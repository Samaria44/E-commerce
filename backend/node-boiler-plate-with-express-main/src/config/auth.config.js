module.exports = {
    secret: process.env.JWT_SECRET || "fallback-secret-change-in-production",
    jwtExpiration: parseInt(process.env.JWT_EXPIRATION) || 3600,         // 1 hour
    jwtRefreshExpiration: parseInt(process.env.JWT_REFRESH_EXPIRATION) || 86400, // 24 hours
  
    /* for test */
    // jwtExpiration: 60,          // 1 minute
    // jwtRefreshExpiration: 120,  // 2 minutes
  };
  