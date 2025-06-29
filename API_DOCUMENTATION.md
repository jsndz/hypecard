# HypeCard Backend API Documentation

## Base URL

```
http://localhost:3001/api
```

## Authentication

Most endpoints require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <supabase_jwt_token>
```

---

## 🔐 Authentication Endpoints

### POST /api/login

Authenticate user with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    },
    "session": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token",
      "expires_at": 1234567890
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `400`: Missing email or password
- `401`: Invalid credentials
- `500`: Internal server error

---

### POST /api/signup

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    },
    "session": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token",
      "expires_at": 1234567890
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `400`: Missing email/password or registration failed
- `500`: Internal server error

---

### GET /api/me

Get current authenticated user information.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "is_pro": false,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `401`: Authentication required or invalid token
- `500`: Internal server error

---

## 🎥 Video Management Endpoints

### POST /api/form

Create a new video with form data.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "formType": "personal",
  "name": "John Doe",
  "role": "Software Engineer",
  "tagline": "Building amazing web applications",
  "description": "I'm passionate about creating user-friendly software solutions.",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": 123,
    "video_url": "https://tavus.com/video/abc123",
    "status": "processing",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `400`: Missing required fields (formType, name)
- `401`: Authentication required
- `403`: Free users limited to 1 video (upgrade to Pro required)
- `502`: Video generation service temporarily unavailable
- `500`: Failed to create video

---

### GET /api/videos

Get all videos for the authenticated user.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "id": 123,
        "user_id": "uuid",
        "name": "John Doe",
        "role": "Software Engineer",
        "tagline": "Building amazing web applications",
        "description": "I'm passionate about creating user-friendly software solutions.",
        "avatar": "https://example.com/avatar.jpg",
        "video_url": "https://tavus.com/video/abc123",
        "tavus_video_id": "tavus_123",
        "status": "completed",
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `401`: Authentication required
- `500`: Failed to retrieve videos

---

### DELETE /api/videos/:id

Delete a specific video.

**Headers:**

```
Authorization: Bearer <token>
```

**Parameters:**

- `id` (path): Video ID to delete

**Response (200):**

```json
{
  "success": true,
  "data": {
    "message": "Video deleted successfully"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `401`: Authentication required
- `404`: Video not found or doesn't belong to user
- `500`: Failed to delete video

---

## 🃏 Public Card Endpoints

### GET /api/card/:id

Get public video card data by ID (no authentication required).

**Parameters:**

- `id` (path): Video card ID

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "John Doe",
    "role": "Software Engineer",
    "tagline": "Building amazing web applications",
    "description": "I'm passionate about creating user-friendly software solutions.",
    "avatar": "https://example.com/avatar.jpg",
    "video_url": "https://tavus.com/video/abc123",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `400`: Invalid card ID
- `404`: Card not found
- `500`: Failed to retrieve card

---

### GET /api/card/:id/share

Get shareable link information for a video card.

**Parameters:**

- `id` (path): Video card ID

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 123,
    "title": "John Doe's HypeCard",
    "description": "Building amazing web applications",
    "url": "https://hypecard.com/card/123",
    "image": "https://example.com/avatar.jpg"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `400`: Invalid card ID
- `404`: Card not found
- `500`: Failed to generate share data

---

## 💳 Subscription Endpoints

### POST /api/subscribe/webhook

Handle RevenueCat subscription webhooks (for internal use).

**Headers:**

```
Content-Type: application/json
X-RevenueCat-Signature: <webhook_signature>
```

**Request Body:**

```json
{
  "type": "INITIAL_PURCHASE",
  "app_user_id": "user_uuid",
  "product_id": "pro_monthly",
  "event_timestamp_ms": 1234567890000,
  "subscriber": {
    "entitlements": {
      "pro": {
        "expires_date": "2024-02-01T00:00:00.000Z"
      }
    }
  }
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "message": "Webhook processed successfully",
    "user_id": "user_uuid",
    "is_pro": true
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `400`: Invalid JSON payload or missing user ID
- `401`: Invalid webhook signature
- `500`: Failed to process webhook

---

### GET /api/subscribe/status

Check subscription status for authenticated user.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "is_pro": true,
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

- `401`: Authentication required
- `500`: Failed to check subscription status

---

## 🏥 Health Check Endpoint

### GET /health

Check if the API is running (no authentication required).

**Response (200):**

```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "HypeCard Backend"
}
```

---

## 📋 Error Response Format

All error responses follow this consistent format:

```json
{
  "error": {
    "message": "Error description",
    "status": 400,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🔒 Security Notes

1. **Authentication**: Most endpoints require a valid Supabase JWT token
2. **CORS**: API only accepts requests from configured frontend URL
3. **Rate Limiting**: Consider implementing rate limiting for production
4. **Webhook Security**: RevenueCat webhook signature verification is recommended for production
5. **Environment Variables**: All sensitive keys should be stored in environment variables

## 📊 Business Logic

- **Free Users**: Limited to 1 video
- **Pro Users**: Unlimited videos
- **Video Generation**: Server-side only (Tavus API key never exposed to frontend)
- **Card Sharing**: Public access for sharing video cards
- **Subscription Sync**: RevenueCat webhooks automatically update Pro status

## 🚀 Getting Started

1. Copy `.env.example` to `.env` and fill in your API keys
2. Run `npm install` to install dependencies
3. Start the server with `npm run dev`
4. API will be available at `http://localhost:3001`
