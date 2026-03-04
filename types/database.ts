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
          full_name: string
          role: 'admin' | 'advisor' | 'compliance'
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          role?: 'admin' | 'advisor' | 'compliance'
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          full_name?: string
          role?: 'admin' | 'advisor' | 'compliance'
          avatar_url?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          author_id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          featured_image_url: string | null
          category: string | null
          tags: string[]
          status: 'draft' | 'pending_review' | 'approved' | 'published' | 'rejected'
          published_at: string | null
          scheduled_for: string | null
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          author_id: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
          featured_image_url?: string | null
          category?: string | null
          tags?: string[]
          status?: 'draft' | 'pending_review' | 'approved' | 'published' | 'rejected'
          published_at?: string | null
          scheduled_for?: string | null
          seo_title?: string | null
          seo_description?: string | null
        }
        Update: {
          title?: string
          excerpt?: string | null
          content?: string
          featured_image_url?: string | null
          category?: string | null
          tags?: string[]
          status?: 'draft' | 'pending_review' | 'approved' | 'published' | 'rejected'
          published_at?: string | null
          scheduled_for?: string | null
          seo_title?: string | null
          seo_description?: string | null
          updated_at?: string
        }
      }
      pages: {
        Row: {
          id: string
          author_id: string
          title: string
          slug: string
          content: string
          template: 'standard' | 'landing' | 'guide' | 'case-study'
          status: 'draft' | 'pending_review' | 'approved' | 'published' | 'rejected'
          meta_title: string | null
          meta_description: string | null
          featured_image_url: string | null
          is_ai_generated: boolean
          ai_generation_id: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          author_id: string
          title: string
          slug: string
          content: string
          template?: 'standard' | 'landing' | 'guide' | 'case-study'
          status?: 'draft' | 'pending_review' | 'approved' | 'published' | 'rejected'
          meta_title?: string | null
          meta_description?: string | null
          featured_image_url?: string | null
          is_ai_generated?: boolean
          ai_generation_id?: string | null
          published_at?: string | null
        }
        Update: {
          title?: string
          content?: string
          template?: 'standard' | 'landing' | 'guide' | 'case-study'
          status?: 'draft' | 'pending_review' | 'approved' | 'published' | 'rejected'
          meta_title?: string | null
          meta_description?: string | null
          featured_image_url?: string | null
          is_ai_generated?: boolean
          ai_generation_id?: string | null
          published_at?: string | null
          updated_at?: string
        }
      }
      compliance_queue: {
        Row: {
          id: string
          content_type: 'blog_post' | 'page' | 'advisor_profile'
          content_id: string
          submitted_by: string
          submitted_at: string
          reviewer_id: string | null
          reviewed_at: string | null
          status: 'pending' | 'approved' | 'rejected'
          reviewer_notes: string | null
          changes_summary: string | null
          content_snapshot: Json
          created_at: string
        }
        Insert: {
          content_type: 'blog_post' | 'page' | 'advisor_profile'
          content_id: string
          submitted_by: string
          status?: 'pending' | 'approved' | 'rejected'
          reviewer_notes?: string | null
          changes_summary?: string | null
          content_snapshot?: Json
        }
        Update: {
          reviewer_id?: string | null
          reviewed_at?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          reviewer_notes?: string | null
        }
      }
      advisor_profiles: {
        Row: {
          id: string
          user_id: string
          slug: string
          display_name: string
          title: string | null
          bio: string | null
          short_bio: string | null
          phone: string | null
          email: string | null
          certifications: string[] | null
          specialties: string[] | null
          profile_image_url: string | null
          headshot_url: string | null
          social_links: Json
          display_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          slug: string
          display_name: string
          title?: string | null
          bio?: string | null
          short_bio?: string | null
          phone?: string | null
          email?: string | null
          certifications?: string[] | null
          specialties?: string[] | null
          profile_image_url?: string | null
          headshot_url?: string | null
          social_links?: Json
          display_order?: number
          is_published?: boolean
        }
        Update: {
          display_name?: string
          title?: string | null
          bio?: string | null
          short_bio?: string | null
          phone?: string | null
          email?: string | null
          certifications?: string[] | null
          specialties?: string[] | null
          profile_image_url?: string | null
          headshot_url?: string | null
          social_links?: Json
          display_order?: number
          is_published?: boolean
          updated_at?: string
        }
      }
    }
  }
}
