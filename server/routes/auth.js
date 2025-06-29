const express = require("express");
const { supabase, upsertUser } = require("../services/supabaseClient");
const { authenticateUser } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * POST /api/login
 * Authenticate user with email and password
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: {
          message: "Email and password are required",
          status: 400,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        error: {
          message: error.message || "Invalid credentials",
          status: 401,
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (!data.user || !data.session) {
      return res.status(401).json({
        error: {
          message: "Authentication failed",
          status: 401,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Ensure user exists in our users table
    await upsertUser({
      id: data.user.id,
      email: data.user.email,
      is_pro: false, // Default to false, will be updated by RevenueCat webhook
    });
    console.log("here");

    res.json({
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * POST /api/signup
 * Register a new user
 */
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: {
          message: "Email and password are required",
          status: 400,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Create user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({
        error: {
          message: error.message || "Registration failed",
          status: 400,
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (!data.user) {
      return res.status(400).json({
        error: {
          message: "Registration failed",
          status: 400,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Create user record in our users table
    await upsertUser({
      id: data.user.id,
      email: data.user.email,
      is_pro: false,
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
        },
        session: data.session
          ? {
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
              expires_at: data.session.expires_at,
            }
          : null,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * GET /api/me
 * Get current user information
 */
router.get("/me", authenticateUser, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get user error:", error);

    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

module.exports = router;
