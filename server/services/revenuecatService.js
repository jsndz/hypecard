const axios = require('axios');
const crypto = require('crypto');

if (!process.env.REVENUECAT_SECRET_KEY) {
  throw new Error('Missing REVENUECAT_SECRET_KEY environment variable');
}

const REVENUECAT_API_BASE_URL = 'https://api.revenuecat.com/v1';

const revenuecatClient = axios.create({
  baseURL: REVENUECAT_API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${process.env.REVENUECAT_SECRET_KEY}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Verify RevenueCat webhook signature
 * @param {string} body - Raw request body
 * @param {string} signature - Signature from RevenueCat
 * @returns {boolean} - Whether the signature is valid
 */
const verifyWebhookSignature = (body, signature) => {
  try {
    if (!signature) {
      return false;
    }
    
    // Remove the 'sha256=' prefix if present
    const cleanSignature = signature.replace('sha256=', '');
    
    // Create HMAC with your RevenueCat webhook secret
    const hmac = crypto.createHmac('sha256', process.env.REVENUECAT_SECRET_KEY);
    hmac.update(body, 'utf8');
    const calculatedSignature = hmac.digest('hex');
    
    // Compare signatures using constant-time comparison
    return crypto.timingSafeEqual(
      Buffer.from(cleanSignature, 'hex'),
      Buffer.from(calculatedSignature, 'hex')
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
};

/**
 * Check if a user has an active Pro subscription
 * @param {string} userId - The user ID to check
 * @returns {Promise<boolean>} - Whether the user has Pro access
 */
const checkProStatus = async (userId) => {
  try {
    const response = await revenuecatClient.get(`/subscribers/${userId}`);
    
    const subscriber = response.data.subscriber;
    
    if (!subscriber || !subscriber.entitlements) {
      return false;
    }
    
    // Check if user has active Pro entitlement
    const proEntitlement = subscriber.entitlements.pro || subscriber.entitlements.premium;
    
    return proEntitlement && proEntitlement.expires_date > new Date().toISOString();
    
  } catch (error) {
    console.error('RevenueCat Pro Status Check Error:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      // User not found in RevenueCat, assume not Pro
      return false;
    }
    
    throw new Error('Failed to check Pro status');
  }
};

/**
 * Process RevenueCat webhook event
 * @param {Object} event - The webhook event data
 * @returns {Object} - Processed event information
 */
const processWebhookEvent = (event) => {
  try {
    const eventType = event.type;
    const appUserId = event.app_user_id;
    const productId = event.product_id;
    const isProSubscription = productId && (productId.includes('pro') || productId.includes('premium'));
    
    let isPro = false;
    
    switch (eventType) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
      case 'NON_RENEWING_PURCHASE':
        isPro = isProSubscription;
        break;
      case 'CANCELLATION':
      case 'EXPIRATION':
      case 'REFUND':
        isPro = false;
        break;
      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
        break;
    }
    
    return {
      userId: appUserId,
      eventType,
      isPro,
      productId,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    throw new Error('Failed to process webhook event');
  }
};

module.exports = {
  verifyWebhookSignature,
  checkProStatus,
  processWebhookEvent
};