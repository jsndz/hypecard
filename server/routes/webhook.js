const express = require('express');
const { supabase } = require('../services/supabaseClient');
const { verifyWebhookSignature, processWebhookEvent } = require('../services/revenuecatService');

const router = express.Router();

/**
 * POST /api/subscribe/webhook
 * Handle RevenueCat subscription webhooks
 */
router.post('/subscribe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-revenuecat-signature'];
    const rawBody = req.body;
    
    // Verify webhook signature (optional but recommended)
    if (process.env.NODE_ENV === 'production' && !verifyWebhookSignature(rawBody, signature)) {
      console.error('Invalid webhook signature');
      return res.status(401).json({
        error: {
          message: 'Invalid signature',
          status: 401,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Parse the webhook payload
    let webhookData;
    try {
      webhookData = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('Failed to parse webhook payload:', parseError);
      return res.status(400).json({
        error: {
          message: 'Invalid JSON payload',
          status: 400,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    console.log('Received RevenueCat webhook:', webhookData.type);
    
    // Process the webhook event
    const eventInfo = processWebhookEvent(webhookData);
    
    if (!eventInfo.userId) {
      console.error('No user ID found in webhook event');
      return res.status(400).json({
        error: {
          message: 'Invalid webhook event - missing user ID',
          status: 400,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Update user's Pro status in database
    const { error: updateError } = await supabase
      .from('users')
      .upsert({
        id: eventInfo.userId,
        is_pro: eventInfo.isPro,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });
    
    if (updateError) {
      console.error('Failed to update user Pro status:', updateError);
      throw updateError;
    }
    
    console.log(`Updated user ${eventInfo.userId} Pro status to: ${eventInfo.isPro}`);
    
    // Log the webhook event (optional)
    await supabase
      .from('webhook_events')
      .insert({
        event_type: 'revenuecat',
        user_id: eventInfo.userId,
        event_data: webhookData,
        processed_at: new Date().toISOString()
      })
      .select()
      .single()
      .catch(error => {
        // Log error but don't fail the webhook
        console.error('Failed to log webhook event:', error);
      });
    
    res.json({
      success: true,
      data: {
        message: 'Webhook processed successfully',
        user_id: eventInfo.userId,
        is_pro: eventInfo.isPro
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    
    res.status(500).json({
      error: {
        message: 'Failed to process webhook',
        status: 500,
        timestamp: new Date().toISOString()
      }
    });
  }
});

/**
 * GET /api/subscribe/status
 * Check subscription status for authenticated user
 */
router.get('/subscribe/status', require('../middlewares/authMiddleware').authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's current Pro status from database
    const { data: user, error } = await supabase
      .from('users')
      .select('is_pro, updated_at')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }
    
    const isPro = user?.is_pro || false;
    
    res.json({
      success: true,
      data: {
        is_pro: isPro,
        updated_at: user?.updated_at || null
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Subscription status check error:', error);
    
    res.status(500).json({
      error: {
        message: 'Failed to check subscription status',
        status: 500,
        timestamp: new Date().toISOString()
      }
    });
  }
});

module.exports = router;