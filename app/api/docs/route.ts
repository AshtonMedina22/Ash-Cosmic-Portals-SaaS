/**
 * API Documentation Endpoint
 * Provides comprehensive API documentation for client developers
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const apiDocs = {
    title: 'Cosmic Portals API Documentation',
    version: '1.0.0',
    description: 'Complete API reference for Cosmic Portals platform',
    base_url: process.env.NEXT_PUBLIC_APP_URL + '/api',
    authentication: {
      type: 'Bearer Token',
      description: 'Include your API key in the Authorization header',
      example: 'Authorization: Bearer your_api_key_here'
    },
    rate_limits: {
      free_tier: '100 requests/hour',
      professional: '1000 requests/hour',
      enterprise: '10000 requests/hour'
    },
    endpoints: {
      organizations: {
        'GET /api/organizations': {
          description: 'Get organization details',
          parameters: [],
          response: {
            status: 200,
            body: {
              id: 'string',
              name: 'string',
              slug: 'string',
              plan_type: 'starter|professional|enterprise',
              subscription_status: 'active|inactive|cancelled'
            }
          }
        },
        'POST /api/organizations': {
          description: 'Create new organization',
          parameters: [
            { name: 'name', type: 'string', required: true },
            { name: 'slug', type: 'string', required: true },
            { name: 'plan_type', type: 'string', required: false }
          ],
          response: {
            status: 201,
            body: 'Organization object'
          }
        }
      },
      events: {
        'GET /api/events': {
          description: 'Get all events for organization',
          parameters: [],
          response: {
            status: 200,
            body: 'Array of Event objects'
          }
        },
        'POST /api/events': {
          description: 'Create new event',
          parameters: [
            { name: 'name', type: 'string', required: true },
            { name: 'description', type: 'string', required: false },
            { name: 'event_type', type: 'string', required: true },
            { name: 'start_date', type: 'string', required: false },
            { name: 'end_date', type: 'string', required: false },
            { name: 'location', type: 'string', required: false }
          ],
          response: {
            status: 201,
            body: 'Event object'
          }
        },
        'GET /api/events/{id}': {
          description: 'Get specific event',
          parameters: [
            { name: 'id', type: 'string', required: true, in: 'path' }
          ],
          response: {
            status: 200,
            body: 'Event object'
          }
        },
        'PUT /api/events/{id}': {
          description: 'Update event',
          parameters: [
            { name: 'id', type: 'string', required: true, in: 'path' },
            { name: 'name', type: 'string', required: false },
            { name: 'description', type: 'string', required: false },
            { name: 'status', type: 'string', required: false }
          ],
          response: {
            status: 200,
            body: 'Updated Event object'
          }
        }
      },
      attendees: {
        'GET /api/events/{event_id}/attendees': {
          description: 'Get event attendees',
          parameters: [
            { name: 'event_id', type: 'string', required: true, in: 'path' }
          ],
          response: {
            status: 200,
            body: 'Array of Attendee objects'
          }
        },
        'POST /api/events/{event_id}/attendees': {
          description: 'Add attendee to event',
          parameters: [
            { name: 'event_id', type: 'string', required: true, in: 'path' },
            { name: 'name', type: 'string', required: true },
            { name: 'email', type: 'string', required: false },
            { name: 'phone', type: 'string', required: false },
            { name: 'plus_ones', type: 'number', required: false },
            { name: 'meal_choice', type: 'string', required: false }
          ],
          response: {
            status: 201,
            body: 'Attendee object'
          }
        },
        'POST /api/attendees/{id}/checkin': {
          description: 'Check in attendee',
          parameters: [
            { name: 'id', type: 'string', required: true, in: 'path' }
          ],
          response: {
            status: 200,
            body: 'Updated Attendee object'
          }
        }
      },
      nfc_devices: {
        'GET /api/nfc/devices': {
          description: 'Get all NFC devices',
          parameters: [],
          response: {
            status: 200,
            body: 'Array of NFC Device objects'
          }
        },
        'POST /api/nfc/devices': {
          description: 'Register new NFC device',
          parameters: [
            { name: 'device_id', type: 'string', required: true },
            { name: 'device_type', type: 'string', required: true },
            { name: 'metadata', type: 'object', required: false }
          ],
          response: {
            status: 201,
            body: 'NFC Device object'
          }
        },
        'GET /api/nfc/devices/{id}/analytics': {
          description: 'Get device analytics',
          parameters: [
            { name: 'id', type: 'string', required: true, in: 'path' },
            { name: 'start_date', type: 'string', required: false, in: 'query' },
            { name: 'end_date', type: 'string', required: false, in: 'query' }
          ],
          response: {
            status: 200,
            body: 'Analytics object with scan data'
          }
        }
      },
      analytics: {
        'GET /api/analytics/dashboard': {
          description: 'Get analytics dashboard data',
          parameters: [
            { name: 'start_date', type: 'string', required: false, in: 'query' },
            { name: 'end_date', type: 'string', required: false, in: 'query' }
          ],
          response: {
            status: 200,
            body: 'Dashboard analytics object'
          }
        },
        'GET /api/analytics/events': {
          description: 'Get analytics events',
          parameters: [
            { name: 'event_type', type: 'string', required: false, in: 'query' },
            { name: 'start_date', type: 'string', required: false, in: 'query' },
            { name: 'end_date', type: 'string', required: false, in: 'query' }
          ],
          response: {
            status: 200,
            body: 'Array of Analytics Event objects'
          }
        },
        'POST /api/analytics/track': {
          description: 'Track custom analytics event',
          parameters: [
            { name: 'event_type', type: 'string', required: true },
            { name: 'page_url', type: 'string', required: false },
            { name: 'referrer', type: 'string', required: false },
            { name: 'utm_source', type: 'string', required: false },
            { name: 'utm_medium', type: 'string', required: false },
            { name: 'utm_campaign', type: 'string', required: false },
            { name: 'custom_data', type: 'object', required: false }
          ],
          response: {
            status: 201,
            body: 'Analytics Event object'
          }
        }
      },
      hardware: {
        'GET /api/hardware/products': {
          description: 'Get hardware products',
          parameters: [
            { name: 'category', type: 'string', required: false, in: 'query' }
          ],
          response: {
            status: 200,
            body: 'Array of Hardware Product objects'
          }
        },
        'GET /api/hardware/kits': {
          description: 'Get hardware kits',
          parameters: [],
          response: {
            status: 200,
            body: 'Array of Hardware Kit objects'
          }
        },
        'POST /api/hardware/orders': {
          description: 'Create hardware order',
          parameters: [
            { name: 'customer_email', type: 'string', required: true },
            { name: 'shipping_address', type: 'object', required: true },
            { name: 'items', type: 'array', required: true }
          ],
          response: {
            status: 201,
            body: 'Hardware Order object'
          }
        }
      }
    },
    data_models: {
      Organization: {
        id: 'string',
        name: 'string',
        slug: 'string',
        plan_type: 'starter|professional|enterprise',
        subscription_status: 'active|inactive|cancelled',
        settings: 'object',
        created_at: 'string',
        updated_at: 'string'
      },
      Event: {
        id: 'string',
        organization_id: 'string',
        name: 'string',
        description: 'string',
        event_type: 'business|wedding|corporate|school|nonprofit|community',
        start_date: 'string',
        end_date: 'string',
        location: 'string',
        status: 'draft|published|live|completed|cancelled',
        created_at: 'string',
        updated_at: 'string'
      },
      Attendee: {
        id: 'string',
        event_id: 'string',
        organization_id: 'string',
        name: 'string',
        email: 'string',
        phone: 'string',
        check_in_time: 'string',
        check_out_time: 'string',
        photo_url: 'string',
        plus_ones: 'number',
        meal_choice: 'string',
        dietary_restrictions: 'string',
        created_at: 'string',
        updated_at: 'string'
      },
      NFCDevice: {
        id: 'string',
        organization_id: 'string',
        device_id: 'string',
        device_type: 'business_card|signage|event_badge|table_tent',
        status: 'active|inactive|maintenance',
        last_scan: 'string',
        scan_count: 'number',
        metadata: 'object',
        created_at: 'string',
        updated_at: 'string'
      }
    },
    error_codes: {
      400: 'Bad Request - Invalid parameters',
      401: 'Unauthorized - Invalid or missing API key',
      403: 'Forbidden - Insufficient permissions',
      404: 'Not Found - Resource not found',
      429: 'Too Many Requests - Rate limit exceeded',
      500: 'Internal Server Error - Server error occurred'
    },
    examples: {
      create_event: {
        method: 'POST',
        url: '/api/events',
        headers: {
          'Authorization': 'Bearer your_api_key_here',
          'Content-Type': 'application/json'
        },
        body: {
          name: 'Company Annual Meeting',
          description: 'Annual company meeting with all employees',
          event_type: 'corporate',
          start_date: '2024-02-15T09:00:00Z',
          end_date: '2024-02-15T17:00:00Z',
          location: 'Convention Center, Room A'
        }
      },
      track_analytics: {
        method: 'POST',
        url: '/api/analytics/track',
        headers: {
          'Authorization': 'Bearer your_api_key_here',
          'Content-Type': 'application/json'
        },
        body: {
          event_type: 'page_view',
          page_url: 'https://example.com/landing',
          referrer: 'https://google.com',
          utm_source: 'google',
          utm_medium: 'cpc',
          utm_campaign: 'summer_sale',
          custom_data: {
            user_agent: 'Mozilla/5.0...',
            device_type: 'mobile'
          }
        }
      }
    },
    sdk_examples: {
      javascript: `
// Install: npm install @cosmic-portals/sdk

import { CosmicPortals } from '@cosmic-portals/sdk';

const client = new CosmicPortals({
  apiKey: 'your_api_key_here',
  baseUrl: 'https://api.cosmic-portals.com'
});

// Create an event
const event = await client.events.create({
  name: 'My Event',
  event_type: 'corporate',
  start_date: '2024-02-15T09:00:00Z'
});

// Track analytics
await client.analytics.track({
  event_type: 'custom_action',
  custom_data: { action: 'button_click' }
});

// Get dashboard data
const dashboard = await client.analytics.getDashboard();
      `,
      python: `
# Install: pip install cosmic-portals-sdk

from cosmic_portals import CosmicPortals

client = CosmicPortals(api_key='your_api_key_here')

# Create an event
event = client.events.create({
    'name': 'My Event',
    'event_type': 'corporate',
    'start_date': '2024-02-15T09:00:00Z'
})

# Track analytics
client.analytics.track({
    'event_type': 'custom_action',
    'custom_data': {'action': 'button_click'}
})

# Get dashboard data
dashboard = client.analytics.get_dashboard()
      `,
      curl: `
# Create an event
curl -X POST https://api.cosmic-portals.com/api/events \\
  -H "Authorization: Bearer your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My Event",
    "event_type": "corporate",
    "start_date": "2024-02-15T09:00:00Z"
  }'

# Track analytics
curl -X POST https://api.cosmic-portals.com/api/analytics/track \\
  -H "Authorization: Bearer your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "event_type": "custom_action",
    "custom_data": {"action": "button_click"}
  }'
      `
    }
  };

  return NextResponse.json(apiDocs, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
