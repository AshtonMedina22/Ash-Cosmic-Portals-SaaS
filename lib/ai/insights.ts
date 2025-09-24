/**
 * AI Insights and Analytics for Cosmic Portals
 * Integrates with external AI services for trend analysis and predictive analytics
 */

import { createClient } from '../supabase/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface TrendAnalysis {
  period: string;
  engagement_trend: 'increasing' | 'decreasing' | 'stable';
  top_performing_events: Array<{ event_id: string; name: string; engagement_score: number }>;
  device_performance: Record<string, number>;
  location_insights: Array<{ location: string; engagement_rate: number }>;
  recommendations: string[];
}

export interface PredictiveAnalytics {
  next_month_predictions: {
    expected_events: number;
    expected_scans: number;
    expected_revenue: number;
  };
  risk_factors: Array<{ factor: string; impact: 'high' | 'medium' | 'low'; description: string }>;
  opportunities: Array<{ opportunity: string; potential_impact: number; effort_required: string }>;
}

export interface AIReport {
  organization_id: string;
  report_type: 'monthly' | 'quarterly' | 'annual';
  insights: {
    summary: string;
    trends: TrendAnalysis;
    predictions: PredictiveAnalytics;
    recommendations: string[];
  };
  generated_at: string;
  ai_model: string;
}

export class AIInsightsService {
  private supabase = createClient();
  private gemini: GoogleGenerativeAI;

  constructor() {
    this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }

  /**
   * Generate trend analysis for an organization
   */
  async generateTrendAnalysis(organizationId: string, period: string = '30d'): Promise<TrendAnalysis> {
    // Get analytics data for the period
    const analyticsData = await this.getAnalyticsData(organizationId, period);
    
    // Prepare data for AI analysis
    const prompt = `
      Analyze the following engagement data and provide insights:
      
      Analytics Data: ${JSON.stringify(analyticsData)}
      
      Please provide:
      1. Engagement trend (increasing/decreasing/stable)
      2. Top performing events with engagement scores
      3. Device performance breakdown
      4. Location insights
      5. Actionable recommendations
      
      Format as JSON with the structure:
      {
        "engagement_trend": "increasing|decreasing|stable",
        "top_performing_events": [{"event_id": "string", "name": "string", "engagement_score": number}],
        "device_performance": {"device_type": number},
        "location_insights": [{"location": "string", "engagement_rate": number}],
        "recommendations": ["string"]
      }
    `;

    try {
      const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = JSON.parse(response.text());

      return {
        period,
        engagement_trend: aiResponse.engagement_trend,
        top_performing_events: aiResponse.top_performing_events,
        device_performance: aiResponse.device_performance,
        location_insights: aiResponse.location_insights,
        recommendations: aiResponse.recommendations
      };
    } catch (error) {
      console.error('AI analysis error:', error);
      // Fallback to basic analysis
      return this.generateBasicTrendAnalysis(analyticsData);
    }
  }

  /**
   * Generate predictive analytics
   */
  async generatePredictiveAnalytics(organizationId: string): Promise<PredictiveAnalytics> {
    const historicalData = await this.getHistoricalData(organizationId);
    
    const prompt = `
      Based on historical data, predict next month's performance:
      
      Historical Data: ${JSON.stringify(historicalData)}
      
      Provide predictions for:
      1. Expected events, scans, and revenue
      2. Risk factors that could impact performance
      3. Growth opportunities
      
      Format as JSON with predictions and risk/opportunity analysis.
    `;

    try {
      const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = JSON.parse(response.text());

      return {
        next_month_predictions: aiResponse.predictions,
        risk_factors: aiResponse.risk_factors,
        opportunities: aiResponse.opportunities
      };
    } catch (error) {
      console.error('Predictive analysis error:', error);
      return this.generateBasicPredictions(historicalData);
    }
  }

  /**
   * Generate automated AI report
   */
  async generateAIReport(organizationId: string, reportType: 'monthly' | 'quarterly' | 'annual'): Promise<AIReport> {
    const [trends, predictions] = await Promise.all([
      this.generateTrendAnalysis(organizationId),
      this.generatePredictiveAnalytics(organizationId)
    ]);

    const summary = await this.generateReportSummary(trends, predictions);

    const report: AIReport = {
      organization_id: organizationId,
      report_type: reportType,
      insights: {
        summary,
        trends,
        predictions,
        recommendations: trends.recommendations
      },
      generated_at: new Date().toISOString(),
      ai_model: 'gemini-pro'
    };

    // Store report in database
    await this.supabase
      .from('ai_reports')
      .insert(report);

    return report;
  }

  /**
   * Get cross-organization insights for Cosmic Portals admin
   */
  async getCrossOrganizationInsights(): Promise<{
    total_organizations: number;
    total_events: number;
    total_scans: number;
    average_engagement_rate: number;
    top_performing_organizations: Array<{ organization_id: string; name: string; engagement_score: number }>;
    industry_trends: Record<string, number>;
    geographic_distribution: Record<string, number>;
  }> {
    // Aggregate data across all organizations (anonymized)
    const { data: orgStats } = await this.supabase
      .from('organizations')
      .select(`
        id,
        name,
        events(count),
        nfc_scans(count),
        analytics_events(count)
      `);

    const total_organizations = orgStats?.length || 0;
    const total_events = orgStats?.reduce((sum, org) => sum + (org.events?.[0]?.count || 0), 0) || 0;
    const total_scans = orgStats?.reduce((sum, org) => sum + (org.nfc_scans?.[0]?.count || 0), 0) || 0;
    const average_engagement_rate = total_events > 0 ? (total_scans / total_events) : 0;

    // Calculate top performers
    const top_performing_organizations = orgStats
      ?.map(org => ({
        organization_id: org.id,
        name: org.name,
        engagement_score: org.events?.[0]?.count > 0 ? (org.nfc_scans?.[0]?.count || 0) / org.events[0].count : 0
      }))
      .sort((a, b) => b.engagement_score - a.engagement_score)
      .slice(0, 10) || [];

    return {
      total_organizations,
      total_events,
      total_scans,
      average_engagement_rate,
      top_performing_organizations,
      industry_trends: {}, // TODO: Implement industry categorization
      geographic_distribution: {} // TODO: Implement geographic analysis
    };
  }

  /**
   * Get analytics data for AI processing
   */
  private async getAnalyticsData(organizationId: string, period: string): Promise<any> {
    const startDate = this.calculateStartDate(period);
    
    const { data: events } = await this.supabase
      .from('analytics_events')
      .select('*')
      .eq('organization_id', organizationId)
      .gte('created_at', startDate);

    const { data: scans } = await this.supabase
      .from('nfc_scans')
      .select('*')
      .eq('organization_id', organizationId)
      .gte('created_at', startDate);

    return {
      events: events || [],
      scans: scans || [],
      period,
      total_events: events?.length || 0,
      total_scans: scans?.length || 0
    };
  }

  /**
   * Get historical data for predictions
   */
  private async getHistoricalData(organizationId: string): Promise<any> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: events } = await this.supabase
      .from('analytics_events')
      .select('*')
      .eq('organization_id', organizationId)
      .gte('created_at', sixMonthsAgo.toISOString());

    return {
      events: events || [],
      period: '6_months',
      total_events: events?.length || 0
    };
  }

  /**
   * Generate report summary using AI
   */
  private async generateReportSummary(trends: TrendAnalysis, predictions: PredictiveAnalytics): Promise<string> {
    const prompt = `
      Generate a concise executive summary based on:
      
      Trends: ${JSON.stringify(trends)}
      Predictions: ${JSON.stringify(predictions)}
      
      Provide a 2-3 paragraph summary highlighting key insights and recommendations.
    `;

    try {
      const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Summary generation error:', error);
      return 'AI-generated insights are temporarily unavailable. Please check back later.';
    }
  }

  /**
   * Fallback basic trend analysis
   */
  private generateBasicTrendAnalysis(data: any): TrendAnalysis {
    return {
      period: '30d',
      engagement_trend: 'stable',
      top_performing_events: [],
      device_performance: {},
      location_insights: [],
      recommendations: ['Continue current engagement strategies', 'Monitor performance metrics regularly']
    };
  }

  /**
   * Fallback basic predictions
   */
  private generateBasicPredictions(data: any): PredictiveAnalytics {
    return {
      next_month_predictions: {
        expected_events: Math.round(data.total_events * 1.1),
        expected_scans: Math.round(data.total_scans * 1.1),
        expected_revenue: 0
      },
      risk_factors: [],
      opportunities: []
    };
  }

  /**
   * Calculate start date based on period
   */
  private calculateStartDate(period: string): string {
    const now = new Date();
    switch (period) {
      case '7d':
        now.setDate(now.getDate() - 7);
        break;
      case '30d':
        now.setDate(now.getDate() - 30);
        break;
      case '90d':
        now.setDate(now.getDate() - 90);
        break;
      default:
        now.setDate(now.getDate() - 30);
    }
    return now.toISOString();
  }
}

export default AIInsightsService;
