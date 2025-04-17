import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

/**
 * Middleware to track activity for auditing purposes
 * Records actions in the ActivityLog table
 */
export const trackActivity = asyncHandler(async (req, res, next) => {
  // Get original response end method
  const originalEnd = res.end;
  
  // Replace end method to capture after request is processed
  res.end = async function(chunk, encoding) {
    // Get the authenticated user's database ID
    const userId = req.userId;
    
    // Only track activities for authenticated users
    if (userId) {
      try {
        // Extract information from request
        const { method, originalUrl, body } = req;
        const entityType = getEntityTypeFromUrl(originalUrl);
        const entityId = getEntityIdFromUrl(originalUrl);
        const actionType = getActionTypeFromMethod(method);
        
        if (entityType && actionType) {
          // Create activity log entry
          await prisma.activityLog.create({
            data: {
              entityType,
              entityId: entityId || 'unknown',
              actionType,
              userId,
              previousData: req.previousData || null,
              newData: method !== 'GET' ? body : null,
              details: `${actionType} ${entityType}${entityId ? ` with ID ${entityId}` : ''}`,
              ipAddress: req.ip || req.connection?.remoteAddress,
              userAgent: req.headers['user-agent']
            }
          });
        }
      } catch (error) {
        console.error('Error tracking activity:', error);
        // Don't block the response if logging fails
      }
    }
    
    // Call original end method
    return originalEnd.call(this, chunk, encoding);
  };
  
  next();
});

/**
 * Middleware to track modifications to specific entity types
 * Adds modification history to entities that support it
 */
export const trackModifications = (entityType) => {
  return async (req, res, next) => {
    try {
      // Only track for write operations (POST, PUT, PATCH)
      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        const userId = req.userId;
        
        if (!userId) {
          // Skip modification tracking if no user ID
          return next();
        }
        
        // Handle entity updates with ID
        if (req.params.id && (req.method === 'PUT' || req.method === 'PATCH')) {
          const id = req.params.id;
          let previousData = null;
          
          // Get previous data for comparison
          switch (entityType) {
            case 'Residency':
              previousData = await prisma.residency.findUnique({ where: { id } });
              break;
            case 'Buyer':
              previousData = await prisma.buyer.findUnique({ where: { id } });
              break;
            case 'Deal':
              previousData = await prisma.deal.findUnique({ where: { id } });
              break;
            case 'User':
              previousData = await prisma.user.findUnique({ where: { id } });
              break;
            case 'Qualification':
              previousData = await prisma.qualification.findUnique({ where: { id } });
              break;
            // Add other entity types as needed
          }
          
          if (previousData) {
            // Store for activity log
            req.previousData = previousData;
            
            // Create modification record
            const modification = {
              timestamp: new Date(),
              userId,
              action: req.method === 'PUT' ? 'update' : 'patch',
              changes: {}
            };
            
            // Track changes for each field
            Object.keys(req.body).forEach(key => {
              if (JSON.stringify(previousData[key]) !== JSON.stringify(req.body[key])) {
                modification.changes[key] = {
                  from: previousData[key],
                  to: req.body[key]
                };
              }
            });
            
            // Only add to history if there are changes
            if (Object.keys(modification.changes).length > 0) {
              // Get existing history
              const existingHistory = previousData.modificationHistory || [];
              
              // Add to request body for controller to save
              req.body.modificationHistory = [...existingHistory, modification];
              
              // Add updatedById field
              req.body.updatedById = userId;
            }
          }
        } 
        // Handle new entity creation
        else if (req.method === 'POST') {
          // Set createdById for new entities
          req.body.createdById = userId;
          
          // Also set as updatedById since it's the same for new records
          req.body.updatedById = userId;
          
          // Initialize empty modification history
          req.body.modificationHistory = [];
        }
      }
    } catch (error) {
      console.error(`Error in trackModifications middleware for ${entityType}:`, error);
      // Don't block the request if tracking fails
    }
    
    next();
  };
};

/**
 * Helper function to extract entity type from URL
 */
function getEntityTypeFromUrl(url) {
  if (url.includes('/api/residency')) return 'Residency';
  if (url.includes('/api/buyer')) return 'Buyer';
  if (url.includes('/api/deal')) return 'Deal';
  if (url.includes('/api/user')) return 'User';
  if (url.includes('/api/qualification')) return 'Qualification';
  if (url.includes('/api/buyer-list')) return 'BuyerList';
  return null;
}

/**
 * Helper function to extract entity ID from URL
 */
function getEntityIdFromUrl(url) {
  // Match patterns like /api/entity/ID or /api/entity/action/ID
  const match = url.match(/\/api\/[^\/]+\/([^\/]+)$/) || 
                url.match(/\/api\/[^\/]+\/[^\/]+\/([^\/]+)$/);
  
  if (match && match[1] && !['create', 'all', 'profile', 'sync'].includes(match[1])) {
    return match[1];
  }
  
  return null;
}

/**
 * Helper function to determine action type from HTTP method
 */
function getActionTypeFromMethod(method) {
  switch (method) {
    case 'POST': return 'create';
    case 'PUT': return 'update';
    case 'PATCH': return 'patch';
    case 'DELETE': return 'delete';
    case 'GET': return 'view';
    default: return 'unknown';
  }
}

export default { trackActivity, trackModifications };