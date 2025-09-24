/**
 * Automated Reporting System for Cosmic Portals
 * Generates branded reports, recap pages, and PDF exports
 */

import { createClient } from '../supabase/client';
import { EventService } from './events';
import { AnalyticsService } from './analytics';

export interface EventReport {
  event_id: string;
  organization_id: string;
  report_type: 'recap' | 'analytics' | 'attendee' | 'financial';
  content: {
    summary: string;
    statistics: Record<string, any>;
    charts: Array<{ type: string; data: any; title: string }>;
    recommendations: string[];
  };
  branding: {
    logo_url?: string;
    primary_color: string;
    secondary_color: string;
    custom_css?: string;
  };
  generated_at: string;
  expires_at?: string;
}

export interface RecapPage {
  event_id: string;
  organization_id: string;
  page_url: string;
  content: {
    title: string;
    description: string;
    photo_gallery: Array<{ url: string; caption?: string; uploaded_by: string }>;
    statistics: {
      total_attendees: number;
      check_in_rate: number;
      photos_uploaded: number;
      engagement_score: number;
    };
    highlights: string[];
    thank_you_message: string;
  };
  branding: {
    logo_url?: string;
    primary_color: string;
    secondary_color: string;
    background_image?: string;
  };
  is_public: boolean;
  created_at: string;
}

export class ReportingService {
  private supabase = createClient();
  private eventService = new EventService();
  private analyticsService = new AnalyticsService();

  /**
   * Generate automated event recap page
   */
  async generateEventRecap(eventId: string): Promise<RecapPage> {
    const event = await this.eventService.getEvent(eventId);
    if (!event) throw new Error('Event not found');

    const attendees = await this.eventService.getEventAttendees(eventId);
    const stats = await this.eventService.getEventStats(eventId);
    const photos = await this.eventService.getEventPhotoGallery(eventId);

    // Get organization branding
    const { data: org } = await this.supabase
      .from('organizations')
      .select('white_label_config')
      .eq('id', event.organization_id)
      .single();

    const branding = org?.white_label_config || {
      primary_color: '#8B5CF6',
      secondary_color: '#A78BFA'
    };

    // Generate highlights
    const highlights = this.generateEventHighlights(stats, attendees, photos);

    const recapPage: RecapPage = {
      event_id: eventId,
      organization_id: event.organization_id,
      page_url: `${process.env.NEXT_PUBLIC_APP_URL}/recap/${eventId}`,
      content: {
        title: `${event.name} - Event Recap`,
        description: `Thank you for attending ${event.name}! Here's a look back at the amazing moments we shared together.`,
        photo_gallery: photos.map(photo => ({
          url: photo.photo_url,
          caption: `Photo by ${photo.name}`,
          uploaded_by: photo.name
        })),
        statistics: {
          total_attendees: stats.total_attendees,
          check_in_rate: stats.total_attendees > 0 ? (stats.checked_in / stats.total_attendees) * 100 : 0,
          photos_uploaded: stats.photos_uploaded,
          engagement_score: this.calculateEngagementScore(stats, attendees)
        },
        highlights,
        thank_you_message: this.generateThankYouMessage(event, stats)
      },
      branding: {
        logo_url: branding.logo_url,
        primary_color: branding.primary_color || '#8B5CF6',
        secondary_color: branding.secondary_color || '#A78BFA',
        background_image: branding.background_image
      },
      is_public: true,
      created_at: new Date().toISOString()
    };

    // Store recap page
    await this.supabase
      .from('recap_pages')
      .insert(recapPage);

    return recapPage;
  }

  /**
   * Generate comprehensive event report
   */
  async generateEventReport(eventId: string, reportType: 'recap' | 'analytics' | 'attendee' | 'financial'): Promise<EventReport> {
    const event = await this.eventService.getEvent(eventId);
    if (!event) throw new Error('Event not found');

    const attendees = await this.eventService.getEventAttendees(eventId);
    const stats = await this.eventService.getEventStats(eventId);
    const analytics = await this.analyticsService.getDashboardData(event.organization_id);

    // Get organization branding
    const { data: org } = await this.supabase
      .from('organizations')
      .select('white_label_config')
      .eq('id', event.organization_id)
      .single();

    const branding = org?.white_label_config || {
      primary_color: '#8B5CF6',
      secondary_color: '#A78BFA'
    };

    const report: EventReport = {
      event_id: eventId,
      organization_id: event.organization_id,
      report_type: reportType,
      content: {
        summary: this.generateReportSummary(event, stats, attendees),
        statistics: {
          total_attendees: stats.total_attendees,
          checked_in: stats.checked_in,
          checked_out: stats.checked_out,
          photos_uploaded: stats.photos_uploaded,
          average_check_in_time: stats.average_check_in_time,
          engagement_metrics: analytics
        },
        charts: this.generateReportCharts(stats, attendees, analytics),
        recommendations: this.generateRecommendations(stats, attendees)
      },
      branding: {
        logo_url: branding.logo_url,
        primary_color: branding.primary_color || '#8B5CF6',
        secondary_color: branding.secondary_color || '#A78BFA',
        custom_css: branding.custom_css
      },
      generated_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    };

    // Store report
    await this.supabase
      .from('event_reports')
      .insert(report);

    return report;
  }

  /**
   * Generate PDF report
   */
  async generatePDFReport(reportId: string): Promise<{ pdf_url: string; download_url: string }> {
    const { data: report } = await this.supabase
      .from('event_reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (!report) throw new Error('Report not found');

    // Generate PDF using Puppeteer or similar
    const pdfContent = await this.renderPDFContent(report);
    const pdfBuffer = await this.generatePDFBuffer(pdfContent);

    // Upload to Supabase Storage
    const fileName = `event-report-${report.event_id}-${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from('reports')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf'
      });

    if (uploadError) throw uploadError;

    const { data: urlData } = this.supabase.storage
      .from('reports')
      .getPublicUrl(fileName);

    return {
      pdf_url: urlData.publicUrl,
      download_url: urlData.publicUrl
    };
  }

  /**
   * Send automated follow-up emails
   */
  async sendFollowUpEmails(eventId: string): Promise<void> {
    const event = await this.eventService.getEvent(eventId);
    if (!event) throw new Error('Event not found');

    const attendees = await this.eventService.getEventAttendees(eventId);
    const recapPage = await this.generateEventRecap(eventId);

    // Send emails to attendees
    for (const attendee of attendees) {
      if (attendee.email) {
        await this.sendAttendeeEmail(attendee, event, recapPage);
      }
    }

    // Send summary email to event organizer
    await this.sendOrganizerEmail(event, recapPage, attendees);
  }

  /**
   * Generate event highlights
   */
  private generateEventHighlights(stats: any, attendees: any[], photos: any[]): string[] {
    const highlights: string[] = [];

    if (stats.total_attendees > 0) {
      highlights.push(`${stats.total_attendees} amazing people joined us!`);
    }

    if (stats.checked_in > 0) {
      const checkInRate = (stats.checked_in / stats.total_attendees) * 100;
      highlights.push(`${checkInRate.toFixed(1)}% of attendees checked in successfully`);
    }

    if (photos.length > 0) {
      highlights.push(`${photos.length} photos were shared and uploaded`);
    }

    if (stats.average_check_in_time) {
      highlights.push(`Average check-in time was ${this.formatCheckInTime(stats.average_check_in_time)}`);
    }

    return highlights;
  }

  /**
   * Calculate engagement score
   */
  private calculateEngagementScore(stats: any, attendees: any[]): number {
    let score = 0;
    
    // Check-in rate (40% weight)
    if (stats.total_attendees > 0) {
      score += (stats.checked_in / stats.total_attendees) * 40;
    }

    // Photo uploads (30% weight)
    if (stats.total_attendees > 0) {
      score += (stats.photos_uploaded / stats.total_attendees) * 30;
    }

    // Check-out rate (30% weight)
    if (stats.checked_in > 0) {
      score += (stats.checked_out / stats.checked_in) * 30;
    }

    return Math.round(score);
  }

  /**
   * Generate thank you message
   */
  private generateThankYouMessage(event: any, stats: any): string {
    return `Thank you for making ${event.name} such a memorable experience! Your participation helped create ${stats.total_attendees} connections and ${stats.photos_uploaded} shared moments. We can't wait to see you at our next event!`;
  }

  /**
   * Generate report summary
   */
  private generateReportSummary(event: any, stats: any, attendees: any[]): string {
    return `${event.name} was a tremendous success with ${stats.total_attendees} attendees, ${stats.checked_in} check-ins, and ${stats.photos_uploaded} photos shared. The event achieved a ${this.calculateEngagementScore(stats, attendees)}% engagement score.`;
  }

  /**
   * Generate report charts data
   */
  private generateReportCharts(stats: any, attendees: any[], analytics: any): Array<{ type: string; data: any; title: string }> {
    return [
      {
        type: 'attendance',
        data: {
          total: stats.total_attendees,
          checked_in: stats.checked_in,
          checked_out: stats.checked_out
        },
        title: 'Attendance Overview'
      },
      {
        type: 'engagement',
        data: {
          photos_uploaded: stats.photos_uploaded,
          engagement_score: this.calculateEngagementScore(stats, attendees)
        },
        title: 'Engagement Metrics'
      }
    ];
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(stats: any, attendees: any[]): string[] {
    const recommendations: string[] = [];

    if (stats.checked_in < stats.total_attendees * 0.8) {
      recommendations.push('Consider improving check-in process or sending reminders');
    }

    if (stats.photos_uploaded < stats.total_attendees * 0.3) {
      recommendations.push('Encourage more photo sharing with incentives or contests');
    }

    if (stats.checked_out < stats.checked_in * 0.7) {
      recommendations.push('Implement check-out reminders or automated follow-up');
    }

    return recommendations;
  }

  /**
   * Render PDF content
   */
  private async renderPDFContent(report: any): Promise<string> {
    // This would integrate with a PDF generation service
    // For now, return HTML that can be converted to PDF
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { max-width: 200px; }
            .section { margin-bottom: 30px; }
            .chart { margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${report.content.summary}</h1>
          </div>
          <div class="section">
            <h2>Event Statistics</h2>
            <p>Total Attendees: ${report.content.statistics.total_attendees}</p>
            <p>Checked In: ${report.content.statistics.checked_in}</p>
            <p>Photos Uploaded: ${report.content.statistics.photos_uploaded}</p>
          </div>
          <div class="section">
            <h2>Recommendations</h2>
            <ul>
              ${report.content.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Generate PDF buffer
   */
  private async generatePDFBuffer(htmlContent: string): Promise<Buffer> {
    // This would integrate with Puppeteer or similar
    // For now, return a placeholder
    return Buffer.from(htmlContent);
  }

  /**
   * Send attendee email
   */
  private async sendAttendeeEmail(attendee: any, event: any, recapPage: any): Promise<void> {
    // Email integration would go here
    console.log(`Sending recap email to ${attendee.email} for event ${event.name}`);
  }

  /**
   * Send organizer email
   */
  private async sendOrganizerEmail(event: any, recapPage: any, attendees: any[]): Promise<void> {
    // Email integration would go here
    console.log(`Sending organizer summary for event ${event.name}`);
  }

  /**
   * Format check-in time
   */
  private formatCheckInTime(timeString: string): string {
    const time = new Date(timeString);
    return time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}

export default ReportingService;
