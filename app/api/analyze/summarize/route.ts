import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import * as pdf from 'pdf-parse';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    // Generate unique analysis ID
    const analysisId = randomUUID();
    
    // Save file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = join(process.cwd(), 'temp', `${analysisId}.pdf`);
    
    // Ensure temp directory exists
    const fs = require('fs');
    if (!fs.existsSync(join(process.cwd(), 'temp'))) {
      fs.mkdirSync(join(process.cwd(), 'temp'), { recursive: true });
    }
    
    await writeFile(tempPath, buffer);

    try {
      // Extract text from PDF
      const dataBuffer = await writeFile(tempPath, buffer);
      const pdfData = await pdf.default(buffer);
      const text = pdfData.text;

      if (!text.trim()) {
        throw new Error('Could not extract text from PDF');
      }

      // Generate summary using Gemini AI
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
        Please analyze the following PDF text and provide:
        1. A comprehensive summary (2-3 paragraphs)
        2. 5-7 key points as bullet points
        3. The total word count
        
        Text: ${text.substring(0, 8000)} // Limit to avoid token limits
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();

      // Parse AI response
      const summaryMatch = aiResponse.match(/Summary:?\s*(.*?)(?=Key Points:|$)/s);
      const keyPointsMatch = aiResponse.match(/Key Points?:?\s*([\s\S]*?)(?=Word Count:|$)/s);
      const wordCountMatch = aiResponse.match(/Word Count:?\s*(\d+)/);

      const summary = summaryMatch?.[1]?.trim() || aiResponse.substring(0, 500);
      const keyPointsText = keyPointsMatch?.[1]?.trim() || '';
      const keyPoints = keyPointsText
        .split(/[•\-\*]/)
        .map(point => point.trim())
        .filter(point => point.length > 0)
        .slice(0, 7);
      
      const wordCount = parseInt(wordCountMatch?.[1] || '0') || text.split(' ').length;

      // Clean up temp file
      await unlink(tempPath);

      return NextResponse.json({
        analysisId,
        summary,
        keyPoints,
        wordCount,
        documentName: file.name,
        status: 'completed',
        createdAt: new Date().toISOString()
      });

    } catch (error) {
      // Clean up temp file on error
      try {
        await unlink(tempPath);
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
      throw error;
    }

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process PDF' },
      { status: 500 }
    );
  }
}
