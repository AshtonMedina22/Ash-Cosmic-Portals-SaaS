import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role key (for admin operations)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Database types (generate these with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          created_at: string;
          updated_at: string;
          subscription_tier: string;
          usage_count: number;
          last_activity: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          created_at?: string;
          updated_at?: string;
          subscription_tier?: string;
          usage_count?: number;
          last_activity?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          created_at?: string;
          updated_at?: string;
          subscription_tier?: string;
          usage_count?: number;
          last_activity?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          organization_id: string | null;
          filename: string;
          original_filename: string;
          file_path: string;
          file_size: number;
          file_type: string;
          upload_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          organization_id?: string | null;
          filename: string;
          original_filename: string;
          file_path: string;
          file_size: number;
          file_type: string;
          upload_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          organization_id?: string | null;
          filename?: string;
          original_filename?: string;
          file_path?: string;
          file_size?: number;
          file_type?: string;
          upload_status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      analyses: {
        Row: {
          id: string;
          document_id: string;
          user_id: string;
          organization_id: string | null;
          analysis_type: string;
          status: string;
          input_data: any;
          result_data: any;
          processing_time_ms: number | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          document_id: string;
          user_id: string;
          organization_id?: string | null;
          analysis_type: string;
          status?: string;
          input_data?: any;
          result_data?: any;
          processing_time_ms?: number | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          document_id?: string;
          user_id?: string;
          organization_id?: string | null;
          analysis_type?: string;
          status?: string;
          input_data?: any;
          result_data?: any;
          processing_time_ms?: number | null;
          created_at?: string;
          completed_at?: string | null;
        };
      };
    };
  };
}
