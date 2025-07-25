export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          created_at: string
          estimated_duration: string | null
          id: string
          professional_id: string
          project_id: string
          proposal: string
          proposed_price: number | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          estimated_duration?: string | null
          id?: string
          professional_id: string
          project_id: string
          proposal: string
          proposed_price?: number | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          estimated_duration?: string | null
          id?: string
          professional_id?: string
          project_id?: string
          proposal?: string
          proposed_price?: number | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          client_id: string
          created_at: string
          id: string
          partnership_demand_id: string | null
          professional_id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          partnership_demand_id?: string | null
          professional_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          partnership_demand_id?: string | null
          professional_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_partnership_demand_id_fkey"
            columns: ["partnership_demand_id"]
            isOneToOne: false
            referencedRelation: "partnership_demands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string
          email_notifications: boolean
          id: string
          locations: string[] | null
          notification_delay: number
          professional_id: string
          service_ids: string[] | null
          updated_at: string
          whatsapp_notifications: boolean
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean
          id?: string
          locations?: string[] | null
          notification_delay?: number
          professional_id: string
          service_ids?: string[] | null
          updated_at?: string
          whatsapp_notifications?: boolean
        }
        Update: {
          created_at?: string
          email_notifications?: boolean
          id?: string
          locations?: string[] | null
          notification_delay?: number
          professional_id?: string
          service_ids?: string[] | null
          updated_at?: string
          whatsapp_notifications?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      partnership_applications: {
        Row: {
          created_at: string
          estimated_duration: string | null
          id: string
          partnership_demand_id: string
          professional_id: string
          proposal: string
          proposed_price: number | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          estimated_duration?: string | null
          id?: string
          partnership_demand_id: string
          professional_id: string
          proposal: string
          proposed_price?: number | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          estimated_duration?: string | null
          id?: string
          partnership_demand_id?: string
          professional_id?: string
          proposal?: string
          proposed_price?: number | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partnership_applications_partnership_demand_id_fkey"
            columns: ["partnership_demand_id"]
            isOneToOne: false
            referencedRelation: "partnership_demands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partnership_applications_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partnership_demands: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          collaboration_type: string
          created_at: string
          deadline: string | null
          description: string
          id: string
          location: string | null
          professional_id: string
          required_skills: string | null
          service_id: string
          status: Database["public"]["Enums"]["project_status"]
          title: string
          updated_at: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          collaboration_type: string
          created_at?: string
          deadline?: string | null
          description: string
          id?: string
          location?: string | null
          professional_id: string
          required_skills?: string | null
          service_id: string
          status?: Database["public"]["Enums"]["project_status"]
          title: string
          updated_at?: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          collaboration_type?: string
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          location?: string | null
          professional_id?: string
          required_skills?: string | null
          service_id?: string
          status?: Database["public"]["Enums"]["project_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partnership_demands_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partnership_demands_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      partnerships: {
        Row: {
          created_at: string
          description: string | null
          id: string
          professional1_id: string
          professional2_id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          professional1_id: string
          professional2_id: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          professional1_id?: string
          professional2_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "partnerships_professional1_id_fkey"
            columns: ["professional1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partnerships_professional2_id_fkey"
            columns: ["professional2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_services: {
        Row: {
          created_at: string
          experience_years: number | null
          id: string
          price_range: string | null
          professional_id: string
          service_id: string
        }
        Insert: {
          created_at?: string
          experience_years?: number | null
          id?: string
          price_range?: string | null
          professional_id: string
          service_id: string
        }
        Update: {
          created_at?: string
          experience_years?: number | null
          id?: string
          price_range?: string | null
          professional_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_services_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professional_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          academic_title: string | null
          address: string | null
          address_complement: string | null
          address_number: string | null
          area_of_expertise: string | null
          availability: string | null
          avatar_url: string | null
          bio: string | null
          certifications: string | null
          city: string | null
          company_name: string | null
          company_size: string | null
          created_at: string
          document: string | null
          education: string | null
          email: string
          experience_years: number | null
          hourly_rate: number | null
          id: string
          industry: string | null
          languages: string | null
          lattes_url: string | null
          linkedin_url: string | null
          name: string
          neighborhood: string | null
          phone: string | null
          plan_type: string | null
          portfolio_url: string | null
          postal_code: string | null
          professional_entity: string | null
          profile_completed: boolean | null
          registration_number: string | null
          skills: string | null
          specializations: string | null
          state: string | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          academic_title?: string | null
          address?: string | null
          address_complement?: string | null
          address_number?: string | null
          area_of_expertise?: string | null
          availability?: string | null
          avatar_url?: string | null
          bio?: string | null
          certifications?: string | null
          city?: string | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string
          document?: string | null
          education?: string | null
          email: string
          experience_years?: number | null
          hourly_rate?: number | null
          id: string
          industry?: string | null
          languages?: string | null
          lattes_url?: string | null
          linkedin_url?: string | null
          name: string
          neighborhood?: string | null
          phone?: string | null
          plan_type?: string | null
          portfolio_url?: string | null
          postal_code?: string | null
          professional_entity?: string | null
          profile_completed?: boolean | null
          registration_number?: string | null
          skills?: string | null
          specializations?: string | null
          state?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          academic_title?: string | null
          address?: string | null
          address_complement?: string | null
          address_number?: string | null
          area_of_expertise?: string | null
          availability?: string | null
          avatar_url?: string | null
          bio?: string | null
          certifications?: string | null
          city?: string | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string
          document?: string | null
          education?: string | null
          email?: string
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          industry?: string | null
          languages?: string | null
          lattes_url?: string | null
          linkedin_url?: string | null
          name?: string
          neighborhood?: string | null
          phone?: string | null
          plan_type?: string | null
          portfolio_url?: string | null
          postal_code?: string | null
          professional_entity?: string | null
          profile_completed?: boolean | null
          registration_number?: string | null
          skills?: string | null
          specializations?: string | null
          state?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          client_id: string
          created_at: string
          deadline: string | null
          description: string
          id: string
          location: string | null
          service_id: string
          status: Database["public"]["Enums"]["project_status"]
          title: string
          updated_at: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          client_id: string
          created_at?: string
          deadline?: string | null
          description: string
          id?: string
          location?: string | null
          service_id: string
          status?: Database["public"]["Enums"]["project_status"]
          title: string
          updated_at?: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          client_id?: string
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          location?: string | null
          service_id?: string
          status?: Database["public"]["Enums"]["project_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          project_id: string
          rating: number
          reviewed_id: string
          reviewer_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          project_id: string
          rating: number
          reviewed_id: string
          reviewer_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          project_id?: string
          rating?: number
          reviewed_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewed_id_fkey"
            columns: ["reviewed_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      application_status: "pending" | "accepted" | "rejected"
      project_status:
        | "draft"
        | "open"
        | "in_progress"
        | "completed"
        | "cancelled"
      user_type: "client" | "professional" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: ["pending", "accepted", "rejected"],
      project_status: [
        "draft",
        "open",
        "in_progress",
        "completed",
        "cancelled",
      ],
      user_type: ["client", "professional", "admin"],
    },
  },
} as const
