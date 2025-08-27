import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create Supabase client with service role key for server-side operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Database table types
export interface Subaccount {
  id: string
  ghl_location_id: string
  agency_name?: string
  created_at: string
}

export interface Order {
  id: string
  subaccount_id: string
  platform: string
  external_order_id: string
  order_date: string
  delivery_date?: string
  total_price?: number
  address: string
  product_summary?: string
  client_email: string
  client_name: string
  delivery_status: 'placed' | 'delivered'
  property_site_url?: string
  zillow_status?: string
  parser_version: string
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  subaccount_id: string
  ghl_contact_id?: string
  email: string
  name: string
  lifetime_orders?: number
  lifetime_revenue?: number
  ytd_orders?: number
  ytd_revenue?: number
  mtd_orders?: number
  mtd_revenue?: number
  wtd_orders?: number
  wtd_revenue?: number
  lifetime_aov?: number
  first_order_date?: string
  last_order_date?: string
  updated_at: string
}

export interface WebhookLog {
  id: string
  subaccount_id?: string
  platform: string
  event_type: string
  raw_payload: any
  parser_version: string
  received_at: string
}

export interface WebhookError {
  id: string
  subaccount_id?: string
  platform: string
  reason: string
  error_message: string
  raw_payload: any
  created_at: string
}

// Database helper functions
export async function insertOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to insert order: ${error.message}`)
  }

  return data
}

export async function insertWebhookLog(logData: Omit<WebhookLog, 'id' | 'received_at'>) {
  const { data, error } = await supabase
    .from('webhook_logs')
    .insert(logData)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to insert webhook log: ${error.message}`)
  }

  return data
}

export async function insertWebhookError(errorData: Omit<WebhookError, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('webhook_errors')
    .insert(errorData)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to insert webhook error: ${error.message}`)
  }

  return data
}

export async function getSubaccountByGhlLocationId(ghlLocationId: string): Promise<Subaccount | null> {
  const { data, error } = await supabase
    .from('subaccounts')
    .select('*')
    .eq('ghl_location_id', ghlLocationId)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
    throw new Error(`Failed to get subaccount: ${error.message}`)
  }

  return data
}
