import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import fs from "fs";
import { prisma } from "../config/prismaConfig.js";

// Load client.json
const clientConfig = JSON.parse(fs.readFileSync("client.json", "utf8")).web;

passport.use(
  new GoogleStrategy(
    {
      clientID: clientConfig.client_id,
      clientSecret: clientConfig.client_secret,
      callbackURL: clientConfig.redirect_uris[1], // Use the first redirect URI
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user exists in the database
        let user = await prisma.user.findUnique({
          where: { email: profile.emails[0].value },
        });

        if (!user) {
          // If the user doesn't exist, create a new user
          user = await prisma.user.create({
            data: {
              email: profile.emails[0].value,
              name: profile.displayName,
              image: profile.photos[0]?.value,
            },
          });
        }

        // Pass the user object to the next step
        done(null, user);
      } catch (error) {
        console.error("Google OAuth error:", error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serializing user:", user.id);
  done(null, user.id); // Store only the user ID in the session
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log("Deserializing user with ID:", id);
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    console.error("Error during deserialization:", error);
    done(error, null);
  }
});


export default passport;
