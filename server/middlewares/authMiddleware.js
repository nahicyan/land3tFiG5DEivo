// server/middlewares/authMiddleware.js
import { auth } from 'express-oauth2-jwt-bearer';
import dotenv from 'dotenv';
import { prisma } from '../config/prismaConfig.js';

dotenv.config();

// Create middleware for validating access tokens
export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE, // Your API identifier in Auth0
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL, // Your Auth0 domain with https://
  tokenSigningAlg: 'RS256'
});

// Middleware to extract user info from token and sync with database
export const extractUserFromToken = async (req, res, next) => {
  if (req.auth && req.auth.payload) {
    console.log('Extracting user from token payload:', JSON.stringify(req.auth.payload, null, 2));
    
    // Try multiple possible locations for roles and permissions
    const AUTH0_NAMESPACE = process.env.AUTH0_NAMESPACE || 'https://landivo.com';
    
    let roles = [];
    let permissions = [];
    
    // Try all possible locations where roles might be stored
    if (req.auth.payload[`${AUTH0_NAMESPACE}/roles`]) {
      roles = req.auth.payload[`${AUTH0_NAMESPACE}/roles`];
      console.log(`Found roles in ${AUTH0_NAMESPACE}/roles:`, roles);
    } else if (req.auth.payload.roles) {
      roles = req.auth.payload.roles;
      console.log('Found roles in roles claim:', roles);
    } else if (req.auth.payload[`${AUTH0_NAMESPACE}`] && req.auth.payload[`${AUTH0_NAMESPACE}`].roles) {
      roles = req.auth.payload[`${AUTH0_NAMESPACE}`].roles;
      console.log(`Found roles in ${AUTH0_NAMESPACE}.roles:`, roles);
    } else {
      console.log('No roles found in the token payload');
    }
    
    // Try all possible locations where permissions might be stored
    if (req.auth.payload[`${AUTH0_NAMESPACE}/permissions`]) {
      permissions = req.auth.payload[`${AUTH0_NAMESPACE}/permissions`];
      console.log(`Found permissions in ${AUTH0_NAMESPACE}/permissions:`, permissions);
    } else if (req.auth.payload.permissions) {
      permissions = req.auth.payload.permissions;
      console.log('Found permissions in permissions claim:', permissions);
    } else if (req.auth.payload[`${AUTH0_NAMESPACE}`] && req.auth.payload[`${AUTH0_NAMESPACE}`].permissions) {
      permissions = req.auth.payload[`${AUTH0_NAMESPACE}`].permissions;
      console.log(`Found permissions in ${AUTH0_NAMESPACE}.permissions:`, permissions);
    } else {
      console.log('No permissions found in the token payload');
    }

    // Extract user info from the JWT token
    const auth0User = {
      sub: req.auth.payload.sub, // Auth0 user ID
      email: req.auth.payload.email,
      name: req.auth.payload.name || req.auth.payload.nickname || '',
      roles: roles,
      permissions: permissions
    };
    
    console.log('Extracted auth0 user:', auth0User);

    // Check if this user has any roles or permissions (system user)
    if (permissions.length > 0 || roles.length > 0) {
      try {
        // Check if user exists in our database
        let dbUser = await prisma.user.findUnique({
          where: { auth0Id: auth0User.sub }
        });
        
        if (dbUser) {
          // User exists, update login stats
          dbUser = await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              lastLoginAt: new Date(),
              loginCount: { increment: 1 }
            }
          });
          
          // Store database ID for controllers to use
          req.userId = dbUser.id;
          
          // Flag if profile needs completion
          auth0User.needsProfileCompletion = !dbUser.firstName || !dbUser.lastName;
        } else {
          // User doesn't exist but has permissions/roles, so create one
          
          // Check if name looks like an email - don't use email as name
          const nameIsEmail = auth0User.name && auth0User.name.includes('@');
          const validName = nameIsEmail ? '' : auth0User.name;
          
          const names = validName ? validName.split(' ') : [];
          const firstName = names.length > 0 ? names[0] : null;
          const lastName = names.length > 1 ? names.slice(1).join(' ') : null;
          
          // Create new user
          const newUser = await prisma.user.create({
            data: {
              auth0Id: auth0User.sub,
              email: auth0User.email,
              firstName,
              lastName,
              lastLoginAt: new Date(),
              loginCount: 1
            }
          });
          
          // Store database ID for controllers to use
          req.userId = newUser.id;
          
          // Flag if profile needs completion
          auth0User.needsProfileCompletion = !firstName || !lastName;
          
          console.log('Created new user in database:', newUser.id);
        }
      } catch (error) {
        console.error('Error syncing user with database:', error);
        // Continue without database user
      }
    }
    
    // Attach to request object
    req.user = auth0User;
  } else {
    console.log('No auth payload found in request');
  }
  
  next();
};

// Simple middleware to check if user is authenticated
export const ensureAuthenticated = (req, res, next) => {
  if (!req.auth || !req.auth.payload) {
    console.log('Request lacks authentication');
    return res.status(401).json({ message: 'Unauthorized: Missing authentication' });
  }
  next();
};

// Middleware to check if user has required permissions
export const checkPermissions = (requiredPermissions) => {
  return (req, res, next) => {
    if (!req.auth || !req.auth.payload) {
      console.log('Request lacks authentication for permission check');
      return res.status(401).json({ message: 'Unauthorized: Missing authentication' });
    }
    
    const AUTH0_NAMESPACE = process.env.AUTH0_NAMESPACE || 'https://landivo.com';
    
    // Try multiple possible locations for permissions
    let userPermissions = [];
    
    if (req.auth.payload[`${AUTH0_NAMESPACE}/permissions`]) {
      userPermissions = req.auth.payload[`${AUTH0_NAMESPACE}/permissions`];
    } else if (req.auth.payload.permissions) {
      userPermissions = req.auth.payload.permissions;
    } else if (req.auth.payload[`${AUTH0_NAMESPACE}`] && req.auth.payload[`${AUTH0_NAMESPACE}`].permissions) {
      userPermissions = req.auth.payload[`${AUTH0_NAMESPACE}`].permissions;
    }
    
    // Check if user has at least one of the required permissions
    const hasRequiredPermission = requiredPermissions.some(perm => userPermissions.includes(perm));
    
    console.log(`Permission check: Required [${requiredPermissions.join(', ')}], User has [${userPermissions.join(', ')}], Result: ${hasRequiredPermission ? 'GRANTED' : 'DENIED'}`);
    
    if (!hasRequiredPermission) {
      return res.status(403).json({ 
        message: 'Forbidden: Insufficient permissions',
        requiredPermissions,
        userPermissions
      });
    }
    
    next();
  };
};

// Middleware to check if user has required roles (fallback)
export const checkRoles = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.auth || !req.auth.payload) {
      console.log('Request lacks authentication for role check');
      return res.status(401).json({ message: 'Unauthorized: Missing authentication' });
    }
    
    const AUTH0_NAMESPACE = process.env.AUTH0_NAMESPACE || 'https://landivo.com';
    
    // Try multiple possible locations for roles
    let userRoles = [];
    
    if (req.auth.payload[`${AUTH0_NAMESPACE}/roles`]) {
      userRoles = req.auth.payload[`${AUTH0_NAMESPACE}/roles`];
    } else if (req.auth.payload.roles) {
      userRoles = req.auth.payload.roles;
    } else if (req.auth.payload[`${AUTH0_NAMESPACE}`] && req.auth.payload[`${AUTH0_NAMESPACE}`].roles) {
      userRoles = req.auth.payload[`${AUTH0_NAMESPACE}`].roles;
    }
    
    // Check if user has at least one of the required roles
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    
    console.log(`Role check: Required [${requiredRoles.join(', ')}], User has [${userRoles.join(', ')}], Result: ${hasRequiredRole ? 'GRANTED' : 'DENIED'}`);
    
    if (!hasRequiredRole) {
      return res.status(403).json({ 
        message: 'Forbidden: Insufficient permissions',
        requiredRoles,
        userRoles
      });
    }
    
    next();
  };
};