import { NextApiRequest, NextApiResponse } from 'next'
import { detectPlatform } from '@/lib/platformDetector'
import { normalizeOrder } from '@/lib/parsers/normalizeOrder'
import { 
  insertOrder, 
  insertWebhookLog, 
  insertWebhookError,
  getSubaccountByGhlLocationId 
} from '@/lib/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const payload = req.body
    console.log('Received webhook payload:', JSON.stringify(payload, null, 2))

    // Detect platform from payload
    const platform = detectPlatform(payload)
    console.log('Detected platform:', platform)

    if (platform === 'unknown') {
      await insertWebhookError({
        subaccount_id: null,
        platform: 'unknown',
        reason: 'Platform detection failed',
        error_message: 'Could not determine platform from payload structure',
        raw_payload: payload
      })
      return res.status(400).json({ error: 'Unknown platform' })
    }

    // Normalize the order data
    const normalizedOrder = normalizeOrder(platform, payload)
    console.log('Normalized order:', normalizedOrder)

    // Extract subaccount_id from payload (this will need to be customized per platform)
    let subaccount_id: string | null = null
    try {
      // Try to get subaccount_id from various possible locations in the payload
      const ghlLocationId = payload.ghl_location_id || 
                           payload.location_id || 
                           payload.agency_id ||
                           payload.subaccount_id

      if (ghlLocationId) {
        const subaccount = await getSubaccountByGhlLocationId(ghlLocationId)
        subaccount_id = subaccount?.id || null
      }
    } catch (error) {
      console.warn('Could not determine subaccount_id:', error)
    }

    // Insert the normalized order into the database
    const orderData = {
      subaccount_id: subaccount_id || null, // Allow null for now, we'll create a default subaccount later
      platform: normalizedOrder.platform,
      external_order_id: normalizedOrder.external_order_id,
      order_date: normalizedOrder.order_date,
      delivery_date: normalizedOrder.delivery_date,
      total_price: normalizedOrder.total_price,
      address: normalizedOrder.address,
      product_summary: normalizedOrder.product_summary,
      client_email: normalizedOrder.client_email,
      client_name: normalizedOrder.client_name,
      delivery_status: normalizedOrder.delivery_status,
      property_site_url: normalizedOrder.property_site_url,
      zillow_status: null, // Will be populated in future phases
      parser_version: normalizedOrder.parser_version
    }

    const insertedOrder = await insertOrder(orderData)
    console.log('Order inserted successfully:', insertedOrder.id)

    // Log the webhook event
    await insertWebhookLog({
      subaccount_id,
      platform,
      event_type: 'order_event',
      raw_payload: payload,
      parser_version: normalizedOrder.parser_version
    })

    return res.status(200).json({ 
      success: true, 
      order_id: insertedOrder.id,
      platform,
      message: 'Order processed successfully' 
    })

  } catch (error) {
    console.error('Webhook processing error:', error)

    // Log the error
    try {
      const payload = req.body
      const platform = detectPlatform(payload)
      
      await insertWebhookError({
        subaccount_id: null,
        platform,
        reason: 'Webhook processing failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        raw_payload: payload
      })
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }

    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
