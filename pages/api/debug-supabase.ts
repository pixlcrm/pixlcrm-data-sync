import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    // Test Supabase connection
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Try to query the subaccounts table
    const { data: subaccounts, error: subaccountsError } = await supabase
      .from('subaccounts')
      .select('*')
      .limit(1)

    // Try to query the orders table
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(1)

    const connectionTest = {
      supabaseUrl: supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      serviceKeyLength: supabaseServiceKey.length,
      subaccountsQuery: {
        success: !subaccountsError,
        error: subaccountsError?.message || null,
        count: subaccounts?.length || 0
      },
      ordersQuery: {
        success: !ordersError,
        error: ordersError?.message || null,
        count: orders?.length || 0
      }
    }

    return res.status(200).json({
      success: true,
      connection: connectionTest,
      message: 'Supabase connection test'
    })

  } catch (error) {
    console.error('Supabase debug error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
