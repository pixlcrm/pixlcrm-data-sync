export interface NormalizedOrder {
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
  platform: string
  parser_version: string
}

export function normalizeOrder(platform: string, payload: any): NormalizedOrder {
  const parser_version = 'v1.0.0'

  try {
    switch (platform) {
      case 'aryeo':
        return {
          parser_version,
          platform,
          external_order_id: payload.order.id,
          order_date: payload.order.date,
          total_price: payload.order.total_price,
          address: payload.order.address?.full_address || payload.order.address || 'Unknown Address',
          product_summary: payload.order.items?.map((i: any) => i.name).join(' + ') || 'Unknown Products',
          client_email: payload.agent?.email || payload.client?.email || 'unknown@example.com',
          client_name: payload.agent?.name || payload.client?.name || 'Unknown Client',
          delivery_status: 'placed',
          property_site_url: payload.order.property_website_url || null
        }

      case 'hdphotohub':
        return {
          parser_version,
          platform,
          external_order_id: payload.AppointmentId || payload.OrderId || 'unknown',
          order_date: payload.AppointmentDate || payload.OrderDate || new Date().toISOString().split('T')[0],
          delivery_date: payload.DeliveryDate || null,
          total_price: payload.TotalPrice || payload.Price || null,
          address: payload.PropertyAddress || payload.Address || 'Unknown Address',
          product_summary: payload.Services?.join(' + ') || payload.ProductSummary || 'Unknown Services',
          client_email: payload.ClientEmail || payload.Email || 'unknown@example.com',
          client_name: payload.ClientName || payload.Name || 'Unknown Client',
          delivery_status: payload.Status === 'Delivered' ? 'delivered' : 'placed',
          property_site_url: payload.PropertyURL || payload.SiteURL || null
        }

      case 'spiro':
        return {
          parser_version,
          platform,
          external_order_id: payload.job?.id || payload.orderId || 'unknown',
          order_date: payload.job?.date || payload.orderDate || new Date().toISOString().split('T')[0],
          delivery_date: payload.job?.deliveryDate || null,
          total_price: payload.job?.price || payload.totalPrice || null,
          address: payload.job?.address || payload.propertyAddress || 'Unknown Address',
          product_summary: payload.job?.services?.join(' + ') || payload.services || 'Unknown Services',
          client_email: payload.job?.clientEmail || payload.client?.email || 'unknown@example.com',
          client_name: payload.job?.clientName || payload.client?.name || 'Unknown Client',
          delivery_status: payload.job?.status === 'Delivered' ? 'delivered' : 'placed',
          property_site_url: payload.job?.propertyUrl || payload.propertyURL || null
        }

      case 'relahq':
        return {
          parser_version,
          platform,
          external_order_id: payload.orderId || payload.id || 'unknown',
          order_date: payload.orderDate || payload.date || new Date().toISOString().split('T')[0],
          delivery_date: payload.deliveryDate || null,
          total_price: payload.totalPrice || payload.price || null,
          address: payload.propertyAddress || payload.address || 'Unknown Address',
          product_summary: payload.services?.join(' + ') || payload.productSummary || 'Unknown Services',
          client_email: payload.agent?.email || payload.clientEmail || 'unknown@example.com',
          client_name: payload.agent?.fullName || payload.clientName || 'Unknown Client',
          delivery_status: payload.status === 'Delivered' ? 'delivered' : 'placed',
          property_site_url: payload.propertyUrl || payload.siteURL || null
        }

      case 'tonomo':
        return {
          parser_version,
          platform,
          external_order_id: payload.orderId || payload.id || 'unknown',
          order_date: payload.orderDate || payload.date || new Date().toISOString().split('T')[0],
          delivery_date: payload.deliveryDate || null,
          total_price: payload.totalPrice || payload.price || null,
          address: payload.propertyAddress || payload.address || 'Unknown Address',
          product_summary: payload.services?.join(' + ') || payload.productSummary || 'Unknown Services',
          client_email: payload.clientEmail || payload.email || 'unknown@example.com',
          client_name: payload.clientName || payload.name || 'Unknown Client',
          delivery_status: payload.orderStatus === 'Delivered' ? 'delivered' : 'placed',
          property_site_url: payload.propertyUrl || payload.siteURL || null
        }

      default:
        throw new Error(`Unknown platform or missing normalizer for: ${platform}`)
    }
  } catch (err) {
    throw new Error(`Normalization failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
  }
}
