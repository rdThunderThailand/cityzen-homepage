export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      districts: {
        Row: {
          code: string | null
          created_at: string
          id: string
          name_en: string | null
          name_th: string
          province_id: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          name_en?: string | null
          name_th: string
          province_id: string
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          name_en?: string | null
          name_th?: string
          province_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "districts_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          current_participants: number
          description: string | null
          event_date: string
          event_type: string
          id: string
          image_url: string | null
          is_active: boolean
          location: string | null
          max_participants: number | null
          province_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_participants?: number
          description?: string | null
          event_date: string
          event_type?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          max_participants?: number | null
          province_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_participants?: number
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          max_participants?: number | null
          province_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          category: string
          content: string | null
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean
          province_id: string
          published_at: string
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          province_id: string
          published_at?: string
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          province_id?: string
          published_at?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          national_id: string | null
          phone_number: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          national_id?: string | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          national_id?: string | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          priority_conditions: Json | null
          remaining_quota: number
          start_date: string | null
          title: string
          total_quota: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          priority_conditions?: Json | null
          remaining_quota?: number
          start_date?: string | null
          title: string
          total_quota?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          priority_conditions?: Json | null
          remaining_quota?: number
          start_date?: string | null
          title?: string
          total_quota?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      provinces: {
        Row: {
          code: string | null
          created_at: string
          geo_id: number | null
          id: string
          name_en: string | null
          name_th: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          geo_id?: number | null
          id?: string
          name_en?: string | null
          name_th: string
        }
        Update: {
          code?: string | null
          created_at?: string
          geo_id?: number | null
          id?: string
          name_en?: string | null
          name_th?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          admin_note: string | null
          created_at: string
          description: string
          district_id: string | null
          id: string
          image_urls: string[] | null
          latitude: number | null
          longitude: number | null
          province_id: string
          report_type: Database["public"]["Enums"]["report_type"]
          status: Database["public"]["Enums"]["report_status"]
          subdistrict_id: string | null
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_note?: string | null
          created_at?: string
          description: string
          district_id?: string | null
          id?: string
          image_urls?: string[] | null
          latitude?: number | null
          longitude?: number | null
          province_id: string
          report_type?: Database["public"]["Enums"]["report_type"]
          status?: Database["public"]["Enums"]["report_status"]
          subdistrict_id?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_note?: string | null
          created_at?: string
          description?: string
          district_id?: string | null
          id?: string
          image_urls?: string[] | null
          latitude?: number | null
          longitude?: number | null
          province_id?: string
          report_type?: Database["public"]["Enums"]["report_type"]
          status?: Database["public"]["Enums"]["report_status"]
          subdistrict_id?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_subdistrict_id_fkey"
            columns: ["subdistrict_id"]
            isOneToOne: false
            referencedRelation: "subdistricts"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          created_at: string | null
          id: string
          project_id: string | null
          qr_code_data: string
          status: string | null
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          qr_code_data: string
          status?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          qr_code_data?: string
          status?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subdistricts: {
        Row: {
          code: string | null
          created_at: string
          district_id: string
          id: string
          name_en: string | null
          name_th: string
          zip_code: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string
          district_id: string
          id?: string
          name_en?: string | null
          name_th: string
          zip_code?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string
          district_id?: string
          id?: string
          name_en?: string | null
          name_th?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subdistricts_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      reserve_project_quota: {
        Args: { p_project_id: string; p_qr_data: string; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      report_status:
        | "pending"
        | "reviewing"
        | "in_progress"
        | "resolved"
        | "rejected"
      report_type: "road" | "electric" | "water" | "safety" | "other"
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
      report_status: [
        "pending",
        "reviewing",
        "in_progress",
        "resolved",
        "rejected",
      ],
      report_type: ["road", "electric", "water", "safety", "other"],
    },
  },
} as const
