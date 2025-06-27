const { verifySupabaseToken, getUserById } = require('../services/supabaseClient');

/**
 * Middleware to authenticate requests using Supabase JWT
 */
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          message: 'Missing or invalid authorization header',
          status: 401,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return res.status(401).json({
        error: {
          message: 'No token provided',
          status: 401,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Verify the token with Supabase
    const user = await verifySupabaseToken(token);
    
    if (!user) {
      return res.status(401).json({
        error: {
          message: 'Invalid or expired token',
          status: 401,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Get additional user data from our database
    let dbUser;
    try {
      dbUser = await getUserById(user.id);
    } catch (error) {
      // User might not exist in our database yet, create basic user object
      dbUser = {
        id: user.id,
        email: user.email,
        is_pro: false,
        created_at: new Date().toISOString()
      };
    }
    
    // Attach user information to request object
    req.user = {
      id: user.id,
      email: user.email,
      is_pro: dbUser.is_pro || false,
      created_at: dbUser.created_at || new Date().toISOString()
    };
    
    next();
    
  } catch (error) {
    console.error('Authentication error:', error);
    
    return res.status(401).json({
      error: {
        message: 'Authentication failed',
        status: 401,
        timestamp: new Date().toISOString()
      }
    });
  }
};

/**
 * Middleware to check if user has Pro access
 */
const requireProAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: {
        message: 'Authentication required',
        status: 401,
        timestamp: new Date().toISOString()
      }
    });
  }
  
  if (!req.user.is_pro) {
    return res.status(403).json({
      error: {
        message: 'Pro subscription required',
        status: 403,
        timestamp: new Date().toISOString()
      }
    });
  }
  
  next();
};

module.exports = {
  authenticateUser,
  requireProAccess
};