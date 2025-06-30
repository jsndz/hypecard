const express = require("express");
const { supabase } = require("../services/supabaseClient");

const router = express.Router();

/**
 * GET /api/card/:id
 * Get public video card data by ID
 */
router.get("/card/:id", async (req, res) => {
  try {
    const cardId = req.params.id;

    if (!cardId || isNaN(cardId)) {
      return res.status(400).json({
        error: {
          message: "Invalid card ID",
          status: 400,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Fetch video data (public information only)
    const { data: video, error } = await supabase
      .from("videos")
      .select(
        `
        id,
        name,
        role,
        tagline,
        description,
        avatar,
        video_url,
        stream_url,
        download_url,
        created_at
      `
      )
      .eq("id", cardId)
      .single();

    if (error || !video) {
      return res.status(404).json({
        error: {
          message: "Card not found",
          status: 404,
          timestamp: new Date().toISOString(),
        },
      });
    }
    // If stream_url or download_url is missing and video is not failed
    if (
      (!video.stream_url || !video.download_url) &&
      video.tavus_video_id &&
      video.status !== "failed"
    ) {
      try {
        const updatedStatus = await getVideoStatus(video.tavus_video_id);

        const updatedFields = {
          stream_url: updatedStatus.video_url || video.stream_url,
          download_url: updatedStatus.download_url || video.download_url,
          status: updatedStatus.status || video.status,
        };

        // Save updated data
        await supabase.from("videos").update(updatedFields).eq("id", cardId);

        // Merge into video object for return
        Object.assign(video, updatedFields);
      } catch (statusError) {
        console.error(
          "Failed to update video status from Tavus:",
          statusError.message
        );
      }
    }
    // Return public card data
    res.json({
      success: true,
      data: {
        id: video.id,
        name: video.name,
        role: video.role,
        tagline: video.tagline,
        description: video.description,
        avatar: video.avatar,
        video_url: video.video_url,
        stream_url: video.stream_url,
        download_url: video.download_url,
        created_at: video.created_at,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get card error:", error);

    res.status(500).json({
      error: {
        message: "Failed to retrieve card",
        status: 500,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * GET /api/card/:id/share
 * Get shareable link information for a video card
 */
router.get("/card/:id/share", async (req, res) => {
  try {
    const cardId = req.params.id;

    if (!cardId || isNaN(cardId)) {
      return res.status(400).json({
        error: {
          message: "Invalid card ID",
          status: 400,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Verify the card exists
    const { data: video, error } = await supabase
      .from("videos")
      .select("id, name, tagline")
      .eq("id", cardId)
      .single();

    if (error || !video) {
      return res.status(404).json({
        error: {
          message: "Card not found",
          status: 404,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Generate sharing metadata
    const shareData = {
      id: video.id,
      title: `${video.name}'s HypeCard`,
      description: video.tagline || `Check out ${video.name}'s video card`,
      url: `${process.env.FRONTEND_URL || "https://hypecard.com"}/card/${
        video.id
      }`,
      image: video.avatar || null,
    };

    res.json({
      success: true,
      data: shareData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get share data error:", error);

    res.status(500).json({
      error: {
        message: "Failed to generate share data",
        status: 500,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

module.exports = router;
