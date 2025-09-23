import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface AnalysisOptions {
  type: 'summarize' | 'extract' | 'qa' | 'sentiment';
  maxTokens?: number;
  temperature?: number;
}

export interface AnalysisResult {
  summary?: string;
  keyPoints?: string[];
  extractedData?: any;
  sentiment?: 'positive' | 'negative' | 'neutral';
  wordCount: number;
  processingTime: number;
}

export class GeminiAnalyzer {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async analyzePDF(textContent: string, options: AnalysisOptions): Promise<AnalysisResult> {
    const startTime = Date.now();
    
    try {
      let prompt = '';
      
      switch (options.type) {
        case 'summarize':
          prompt = this.createSummarizationPrompt(textContent);
          break;
        case 'extract':
          prompt = this.createExtractionPrompt(textContent);
          break;
        case 'qa':
          prompt = this.createQAPrompt(textContent);
          break;
        case 'sentiment':
          prompt = this.createSentimentPrompt(textContent);
          break;
        default:
          throw new Error('Invalid analysis type');
      }

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const analysisText = response.text();
      
      const processingTime = Date.now() - startTime;
      
      return this.parseAnalysisResult(analysisText, options, processingTime);
      
    } catch (error) {
      console.error('Gemini analysis error:', error);
      throw new Error('Failed to analyze document');
    }
  }

  private createSummarizationPrompt(text: string): string {
    return `
    Please analyze the following document and provide:
    1. A comprehensive summary (2-3 paragraphs)
    2. 5-7 key points as bullet points
    3. The total word count
    
    Document content:
    ${text}
    
    Please format your response as JSON:
    {
      "summary": "Your summary here",
      "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
      "wordCount": 1234
    }
    `;
  }

  private createExtractionPrompt(text: string): string {
    return `
    Please extract structured data from the following document:
    - Names, dates, numbers, addresses
    - Tables and lists
    - Key metrics and statistics
    - Important entities
    
    Document content:
    ${text}
    
    Please format your response as JSON with appropriate categories.
    `;
  }

  private createQAPrompt(text: string): string {
    return `
    Based on the following document, provide a comprehensive analysis that would help answer questions about its content:
    
    Document content:
    ${text}
    
    Please provide:
    1. Main topics and themes
    2. Key information that could be used for Q&A
    3. Important facts and figures
    
    Format as JSON.
    `;
  }

  private createSentimentPrompt(text: string): string {
    return `
    Analyze the sentiment and tone of the following document:
    
    Document content:
    ${text}
    
    Please provide:
    1. Overall sentiment (positive, negative, neutral)
    2. Key emotional indicators
    3. Tone analysis
    
    Format as JSON.
    `;
  }

  private parseAnalysisResult(text: string, options: AnalysisOptions, processingTime: number): AnalysisResult {
    try {
      // Try to parse as JSON first
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          ...parsed,
          processingTime,
          wordCount: parsed.wordCount || this.estimateWordCount(text)
        };
      }
      
      // Fallback: parse structured text
      return this.parseStructuredText(text, options, processingTime);
      
    } catch (error) {
      console.error('Error parsing analysis result:', error);
      return {
        summary: text,
        keyPoints: [text],
        wordCount: this.estimateWordCount(text),
        processingTime
      };
    }
  }

  private parseStructuredText(text: string, options: AnalysisOptions, processingTime: number): AnalysisResult {
    const lines = text.split('\n').filter(line => line.trim());
    const keyPoints: string[] = [];
    let summary = '';
    
    lines.forEach(line => {
      if (line.includes('•') || line.includes('-') || line.match(/^\d+\./)) {
        keyPoints.push(line.replace(/^[•\-\d\.\s]+/, '').trim());
      } else if (line.length > 50) {
        summary += line + ' ';
      }
    });
    
    return {
      summary: summary.trim(),
      keyPoints: keyPoints.length > 0 ? keyPoints : [text],
      wordCount: this.estimateWordCount(text),
      processingTime
    };
  }

  private estimateWordCount(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  // Method for tracking usage analytics
  async trackUsage(userId: string, analysisType: string, processingTime: number) {
    try {
      // In production, this would save to your analytics database
      console.log(`Usage tracked: User ${userId}, Type: ${analysisType}, Time: ${processingTime}ms`);
      
      // Example: Save to Supabase analytics table
      // await supabase.from('usage_analytics').insert({
      //   user_id: userId,
      //   event_type: 'api_call',
      //   event_data: {
      //     analysis_type: analysisType,
      //     processing_time_ms: processingTime
      //   }
      // });
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  }
}

// Export singleton instance
export const geminiAnalyzer = new GeminiAnalyzer();
