export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          plan_tier: 'free' | 'pro' | 'team' | 'enterprise'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          monthly_check_limit: number
          checks_used_this_month: number
          api_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          plan_tier?: 'free' | 'pro' | 'team' | 'enterprise'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          monthly_check_limit?: number
          checks_used_this_month?: number
          api_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          plan_tier?: 'free' | 'pro' | 'team' | 'enterprise'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          monthly_check_limit?: number
          checks_used_this_month?: number
          api_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          user_id: string
          key_hash: string
          key_prefix: string
          name: string
          last_used_at: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          key_hash: string
          key_prefix: string
          name: string
          last_used_at?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          key_hash?: string
          key_prefix?: string
          name?: string
          last_used_at?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      email_checks: {
        Row: {
          id: string
          user_id: string
          check_source: 'web' | 'api'
          api_key_id: string | null
          subject_line: string | null
          email_body: string
          spam_score: number | null
          deliverability_score: number | null
          estimated_inbox_rate: number | null
          verdict: string | null
          analysis_results: Json
          processing_time_ms: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          check_source?: 'web' | 'api'
          api_key_id?: string | null
          subject_line?: string | null
          email_body: string
          spam_score?: number | null
          deliverability_score?: number | null
          estimated_inbox_rate?: number | null
          verdict?: string | null
          analysis_results: Json
          processing_time_ms?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          check_source?: 'web' | 'api'
          api_key_id?: string | null
          subject_line?: string | null
          email_body?: string
          spam_score?: number | null
          deliverability_score?: number | null
          estimated_inbox_rate?: number | null
          verdict?: string | null
          analysis_results?: Json
          processing_time_ms?: number | null
          created_at?: string
        }
      }
      saved_templates: {
        Row: {
          id: string
          user_id: string
          template_name: string
          subject_line: string | null
          email_body: string
          tags: string[] | null
          last_checked_at: string | null
          last_spam_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_name: string
          subject_line?: string | null
          email_body: string
          tags?: string[] | null
          last_checked_at?: string | null
          last_spam_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          template_name?: string
          subject_line?: string | null
          email_body?: string
          tags?: string[] | null
          last_checked_at?: string | null
          last_spam_score?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          owner_id: string
          plan_tier: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          plan_tier?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_id?: string
          plan_tier?: string
          created_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          joined_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'member'
          joined_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member'
          joined_at?: string
        }
      }
      usage_analytics: {
        Row: {
          id: string
          user_id: string
          date: string
          checks_web: number
          checks_api: number
          total_checks: number
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          checks_web?: number
          checks_api?: number
          total_checks?: number
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          checks_web?: number
          checks_api?: number
          total_checks?: number
        }
      }
    }
  }
}

