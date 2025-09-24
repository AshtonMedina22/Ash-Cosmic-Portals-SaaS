/**
 * Events API Routes
 * Handles event CRUD operations and management
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import EventService from '@/lib/events';

const eventService = new EventService();

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get organization ID from user
    const { data: user } = await this.supabase
      .from('users')
      .select('organization_id')
      .eq('clerk_id', userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const events = await eventService.getOrganizationEvents(user.organization_id);
    return NextResponse.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, event_type, start_date, end_date, location, settings } = body;

    if (!name || !event_type) {
      return NextResponse.json(
        { error: 'Name and event type are required' },
        { status: 400 }
      );
    }

    // Get organization ID from user
    const { data: user } = await this.supabase
      .from('users')
      .select('organization_id')
      .eq('clerk_id', userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const event = await eventService.createEvent({
      organization_id: user.organization_id,
      name,
      description,
      event_type,
      start_date,
      end_date,
      location,
      settings
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
