# 🚀 PixlCRM CORE

A webhook-powered data pipeline for PixlCRM that receives orders and deliveries from various platforms, normalizes the data, and stores it in Supabase.

## 🚀 Features

- **Multi-Platform Support**: Handles webhooks from Aryeo, HDPhotoHub, Spiro, RelaHQ, and Tonomo
- **Data Normalization**: Converts platform-specific payloads into a standardized format
- **Robust Error Handling**: Comprehensive logging and error capture
- **Scalable Architecture**: Built with Next.js and Supabase for reliability

## 🏗️ Architecture

```
Webhook → Platform Detection → Data Normalization → Supabase Storage
    ↓              ↓                    ↓                ↓
Error Logging → Webhook Logs → Order Storage → Contact Updates
```

## 📋 Prerequisites

- Node.js 18+ 
- Supabase account
- Vercel account (for deployment)

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd pixlcrm-core
npm install
```

### 2. Supabase Setup

1. Create a new Supabase project
2. Go to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL to create all required tables

### 3. Environment Configuration

1. Copy `env.example` to `.env.local`
2. Fill in your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: Webhook Secret for verification
WEBHOOK_SECRET=your_webhook_secret
```

### 4. Local Development

```bash
npm run dev
```

The webhook endpoint will be available at: `http://localhost:3000/api/webhook/order-event`

### 5. Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy

Your webhook URL will be: `https://your-app.vercel.app/api/webhook/order-event`

## 🔌 Webhook Configuration

### Supported Platforms

| Platform | Detection Criteria | Webhook URL |
|----------|-------------------|-------------|
| Aryeo | `payload.order.id` exists | `/api/webhook/order-event` |
| HDPhotoHub | `payload.AppointmentId` exists | `/api/webhook/order-event` |
| Spiro | `payload.job.status` exists | `/api/webhook/order-event` |
| RelaHQ | `payload.agent.fullName` exists | `/api/webhook/order-event` |
| Tonomo | `payload.orderStatus` exists | `/api/webhook/order-event` |

### Webhook Payload Format

The endpoint accepts POST requests with JSON payloads. The system will:

1. **Detect the platform** automatically
2. **Normalize the data** into a standard format
3. **Store in Supabase** with proper error handling
4. **Log all events** for observability

### Response Format

**Success (200):**
```json
{
  "success": true,
  "order_id": "uuid",
  "platform": "aryeo",
  "message": "Order processed successfully"
}
```

**Error (400/500):**
```json
{
  "error": "Error description",
  "message": "Detailed error message"
}
```

## 📊 Database Schema

### Orders Table
Stores normalized order data from all platforms:
- `external_order_id`: Platform-specific order ID
- `platform`: Source platform (aryeo, hdphotohub, etc.)
- `order_date`: When the order was placed
- `delivery_date`: When the order was delivered
- `total_price`: Order total
- `address`: Property address
- `client_email` & `client_name`: Customer information
- `delivery_status`: 'placed' or 'delivered'

### Webhook Logs Table
Tracks all incoming webhook events for observability:
- `raw_payload`: Original webhook data
- `platform`: Detected platform
- `event_type`: Type of event
- `parser_version`: Version of the normalization logic

### Webhook Errors Table
Captures and stores all processing errors:
- `reason`: Error category
- `error_message`: Detailed error description
- `raw_payload`: Original payload that caused the error

## 🔧 Development

### Project Structure

```
/
├── pages/api/webhook/order-event.ts  # Main webhook endpoint
├── lib/
│   ├── database.ts                   # Supabase client & helpers
│   ├── platformDetector.ts           # Platform detection logic
│   └── parsers/
│       └── normalizeOrder.ts         # Data normalization
├── supabase-schema.sql              # Database schema
└── sample_payloads/                 # Test payloads (reference)
```

### Adding New Platforms

1. Update `lib/platformDetector.ts` with detection logic
2. Add normalization logic in `lib/parsers/normalizeOrder.ts`
3. Test with sample payloads
4. Update documentation

### Testing

Test the webhook endpoint with sample payloads:

```bash
curl -X POST http://localhost:3000/api/webhook/order-event \
  -H "Content-Type: application/json" \
  -d @sample_payloads/aryeo-sample.json
```

## 📈 Monitoring

### Supabase Dashboard
- Monitor `webhook_logs` for incoming events
- Check `webhook_errors` for processing failures
- Review `orders` table for successful data storage

### Vercel Logs
- View function execution logs
- Monitor response times and errors
- Track webhook processing performance

## 🔒 Security

- All database operations use service role key (server-side only)
- Webhook payloads are validated before processing
- Errors are logged but don't expose sensitive information
- Environment variables are properly secured

## 🚀 Next Steps (Phase 2)

- Contact aggregation and metrics calculation
- PixlCRM integration for data sync
- Advanced error recovery mechanisms
- Real-time notifications
- Dashboard for monitoring and management

## 📞 Support

For issues or questions:
1. Check the `webhook_errors` table for processing failures
2. Review Vercel function logs
3. Verify Supabase connection and permissions
4. Test with sample payloads

---

**Built with ❤️ for PixlCRM CORE**
