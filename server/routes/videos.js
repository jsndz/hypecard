const express = require("express");
const { supabase } = require("../services/supabaseClient");
const { generateVideo, getVideoStatus } = require("../services/tavusService");
const { authenticateUser } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * POST /api/form
 * Create a new video with form data
 */
router.post("/form", authenticateUser, async (req, res) => {
  try {
    const { formType, name, role, tagline, description, avatar } = req.body;
    const userId = req.user.id;
    const isPro = req.user.is_pro;

    // Validate required fields
    if (!formType || !name) {
      return res.status(400).json({
        error: {
          message: "Form type and name are required",
          status: 400,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Check video limit for non-Pro users
    if (!isPro) {
      const { data: existingVideos, error: countError } = await supabase
        .from("videos")
        .select("id")
        .eq("user_id", userId);

      if (countError) {
        throw countError;
      }

      if (existingVideos && existingVideos.length >= 1) {
        return res.status(403).json({
          error: {
            message:
              "Free users are limited to 1 video. Upgrade to Pro for unlimited videos.",
            status: 403,
            timestamp: new Date().toISOString(),
          },
        });
      }
    }

    // Generate video with Tavus
    console.log("Generating video for user:", userId);
    const videoData = await generateVideo({
      name,
      role,
      tagline,
      description,
      avatar,
    });

    // Store video data in database
    const { data: savedVideo, error: saveError } = await supabase
      .from("videos")
      .insert({
        user_id: userId,
        name,
        role: role || null,
        tagline: tagline || null,
        description: description || null,
        avatar: avatar || null,
        video_url: videoData.video_url,
        tavus_video_id: videoData.video_id,
        status: videoData.status || "processing",
      })
      .select()
      .single();

    if (saveError) {
      console.error("Database save error:", saveError);
      throw saveError;
    }

    res.status(201).json({
      success: true,
      data: {
        id: savedVideo.id,
        video_url: savedVideo.video_url,
        download_url: savedVideo.download_url,
        stream_url: savedVideo.stream_url,
        status: savedVideo.status,
        created_at: savedVideo.created_at,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Video creation error:", error);

    if (error.message.includes("Tavus")) {
      res.status(502).json({
        error: {
          message: "Video generation service temporarily unavailable",
          status: 502,
          timestamp: new Date().toISOString(),
        },
      });
    } else {
      res.status(500).json({
        error: {
          message: "Failed to create video",
          status: 500,
          timestamp: new Date().toISOString(),
        },
      });
    }
  }
});

/**
 * GET /api/videos
 * Get all videos for the authenticated user
 */
router.get("/videos", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: videos, error } = await supabase
      .from("videos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }
    res.json({
      success: true,
      data: {
        videos: videos || [],
        count: videos ? videos.length : 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get videos error:", error);

    res.status(500).json({
      error: {
        message: "Failed to retrieve videos",
        status: 500,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * GET /api/videoStatus
 * Get video for the authenticated user from tavus
 */
router.get("/videoStatus", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: videos, error } = await supabase
      .from("videos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    console.log(videos);

    const { data } = await getVideoStatus(videos[0].tavus_video_id);
    console.log(data);

    if (error) {
      throw error;
    }
    res.json({
      success: true,
      data: {
        videos: videos || [],
        count: videos ? videos.length : 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get videos error:", error);

    res.status(500).json({
      error: {
        message: "Failed to retrieve videos",
        status: 500,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * DELETE /api/videos/:id
 * Delete a specific video
 */
router.delete("/videos/:id", authenticateUser, async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.id;

    // Step 1: Fetch user to check if they are Pro
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("is_pro")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return res.status(401).json({
        error: {
          message: "User not found or unauthorized",
          status: 401,
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (!user.is_pro) {
      return res.status(403).json({
        error: {
          message: "Only Pro users can delete videos",
          status: 403,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Step 2: Verify the video belongs to the user
    const { data: video, error: fetchError } = await supabase
      .from("videos")
      .select("id")
      .eq("id", videoId)
      .eq("user_id", userId)
      .single();

    if (fetchError || !video) {
      return res.status(404).json({
        error: {
          message: "Video not found",
          status: 404,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Step 3: Delete the video
    const { error: deleteError } = await supabase
      .from("videos")
      .delete()
      .eq("id", videoId)
      .eq("user_id", userId);

    if (deleteError) {
      throw deleteError;
    }

    res.json({
      success: true,
      data: {
        message: "Video deleted successfully",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Delete video error:", error);

    res.status(500).json({
      error: {
        message: "Failed to delete video",
        status: 500,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

module.exports = router;
