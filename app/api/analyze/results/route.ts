import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get('userId');

    if (requestedUserId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // In production, this would query Supabase for the user's analysis results
    // For now, we'll simulate a completed analysis after a delay
    const analysisStartTime = Date.now() - 10000; // 10 seconds ago
    
    if (analysisStartTime > 5000) { // Simulate 5-second processing time
      const mockResult = {
        id: `analysis_${analysisStartTime}_${userId}`,
        summary: `This document appears to be a comprehensive analysis covering multiple key topics. The main themes include strategic planning, operational efficiency, and market analysis. The document provides detailed insights into current market conditions and suggests several actionable recommendations for improvement.`,
        keyPoints: [
          "Strategic planning is essential for long-term success",
          "Operational efficiency can be improved through automation", 
          "Market analysis reveals significant growth opportunities",
          "Customer satisfaction is directly linked to service quality",
          "Technology adoption is crucial for competitive advantage"
        ],
        wordCount: 2847,
        documentName: "sample_document.pdf",
        createdAt: new Date().toISOString()
      };

      return NextResponse.json({ 
        result: mockResult,
        status: 'completed'
      });
    }

    // Analysis still in progress
    return NextResponse.json({ 
      result: null,
      status: 'processing'
    });

  } catch (error) {
    console.error('Error in results route:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
