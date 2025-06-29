const axios = require("axios");

if (!process.env.TAVUS_API_KEY) {
  throw new Error("Missing TAVUS_API_KEY environment variable");
}

const TAVUS_API_BASE_URL = "https://tavusapi.com/v2";

const tavusClient = axios.create({
  baseURL: TAVUS_API_BASE_URL,
  headers: {
    "x-api-key": process.env.TAVUS_API_KEY,
    "Content-Type": "application/json",
  },
});

/**
 * Generate a video using Tavus API
 * @param {Object} videoData - Video generation parameters
 * @returns {Promise<Object>} - Generated video information
 */
const generateVideo = async (videoData) => {
  try {
    const { name, role, tagline, description, avatar } = videoData;
    let replica_id;
    if (avatar === "female") {
      replica_id = "r6ae5b6efc9d";
    } else if (avatar === "male") {
      replica_id = "rf4703150052";
    }

    // Prepare the request payload for Tavus
    const payload = {
      script: `Hello, I'm ${name}${role ? `, ${role}` : ""}. ${tagline || ""} ${
        description || ""
      }`,
      replica_id: replica_id || null,
      video_name: `${name}-HypeCard`,
    };

    console.log("Generating video with Tavus:", payload);

    const response = await tavusClient.post("/videos", payload);

    if (!response.data || !response.data.video_id) {
      throw new Error("Invalid response from Tavus API");
    }
    console.log(response);

    // Return the video information
    return {
      video_id: response.data.video_id,
      video_url: response.data.hosted_url,
      download_url: response.data.download_url,
      status: response.data.status || "processing",
      created_at: new Date().toISOString(),
      stream_url: response.data.stream_url,
    };
  } catch (error) {
    console.error("Tavus API Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      throw new Error("Invalid Tavus API key");
    } else if (error.response?.status === 429) {
      throw new Error("Tavus API rate limit exceeded");
    } else if (error.response?.status >= 400) {
      throw new Error(
        `Tavus API error: ${error.response.data?.message || "Unknown error"}`
      );
    }

    throw new Error("Failed to generate video with Tavus");
  }
};

/**
 * Check the status of a video generation
 * @param {string} videoId - The video ID from Tavus
 * @returns {Promise<Object>} - Video status information
 */
const getVideoStatus = async (videoId) => {
  try {
    const response = await tavusClient.get(`/videos/${videoId}`);
    console.log(response);

    return {
      video_id: response.data.video_id,
      status: response.data.status,
      video_url: response.data.video_url,
      download_url: response.data.download_url,
      progress: response.data.progress || 0,
    };
  } catch (error) {
    console.error(
      "Tavus Status Check Error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to check video status");
  }
};

module.exports = {
  generateVideo,
  getVideoStatus,
};
