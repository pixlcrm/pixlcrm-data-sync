import { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>PixlCRM CORE</title>
        <meta name="description" content="PixlCRM CORE - Webhook-powered data pipeline for PixlCRM" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 PixlCRM CORE
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Webhook-powered data pipeline for processing orders from multiple platforms
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">🚀 Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">API Ready</h3>
                  <p className="text-sm text-green-700">Webhook endpoint is active</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">⚙️</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Multi-Platform</h3>
                  <p className="text-sm text-blue-700">Supports 5 platforms</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">🔌 Webhook Endpoint</h2>
          <div className="bg-gray-100 rounded-md p-4 font-mono text-sm">
            POST /api/webhook/order-event
          </div>
          <p className="text-gray-600 mt-2">
            Configure your platform webhooks to point to this endpoint for order processing.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">📊 Supported Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Aryeo', color: 'bg-purple-100', border: 'border-purple-200' },
              { name: 'HDPhotoHub', color: 'bg-blue-100', border: 'border-blue-200' },
              { name: 'Spiro', color: 'bg-green-100', border: 'border-green-200' },
              { name: 'RelaHQ', color: 'bg-yellow-100', border: 'border-yellow-200' },
              { name: 'Tonomo', color: 'bg-red-100', border: 'border-red-200' },
            ].map((platform) => (
              <div key={platform.name} className={`${platform.color} ${platform.border} border rounded-md p-4 text-center`}>
                <h3 className="font-medium text-gray-900">{platform.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
