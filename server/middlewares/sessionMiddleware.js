export const sessionLogger = (req, res, next) => {
    console.log("Request URL:", req.originalUrl);
    console.log("Session content:", req.session);
    console.log("User:", req.user);
    next();
  };
  
  export const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized access" });
  };
  