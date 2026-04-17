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
      lead_activities: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          id: string
          lead_id: string
          type: Database["public"]["Enums"]["activity_type"]
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          id?: string
          lead_id: string
          type?: Database["public"]["Enums"]["activity_type"]
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          id?: string
          lead_id?: string
          type?: Database["public"]["Enums"]["activity_type"]
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          apply_link: string | null
          closed_at: string | null
          company: string | null
          created_at: string
          email: string | null
          estimated_value: number | null
          id: string
          name: string
          next_action: string | null
          next_action_date: string | null
          notes: string | null
          outreached_at: string | null
          owner_id: string | null
          phone: string | null
          priority: Database["public"]["Enums"]["priority_level"]
          responded_at: string | null
          response: string | null
          source: string | null
          status: Database["public"]["Enums"]["lead_status"]
          tags: string[] | null
          updated_at: string
          useful_links: Json | null
        }
        Insert: {
          apply_link?: string | null
          closed_at?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          estimated_value?: number | null
          id?: string
          name: string
          next_action?: string | null
          next_action_date?: string | null
          notes?: string | null
          outreached_at?: string | null
          owner_id?: string | null
          phone?: string | null
          priority?: Database["public"]["Enums"]["priority_level"]
          responded_at?: string | null
          response?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          tags?: string[] | null
          updated_at?: string
          useful_links?: Json | null
        }
        Update: {
          apply_link?: string | null
          closed_at?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          estimated_value?: number | null
          id?: string
          name?: string
          next_action?: string | null
          next_action_date?: string | null
          notes?: string | null
          outreached_at?: string | null
          owner_id?: string | null
          phone?: string | null
          priority?: Database["public"]["Enums"]["priority_level"]
          responded_at?: string | null
          response?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          tags?: string[] | null
          updated_at?: string
          useful_links?: Json | null
        }
        Relationships: []
      }
      milestones: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          is_completed: boolean
          project_id: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean
          project_id: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean
          project_id?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_updates: {
        Row: {
          author_id: string | null
          created_at: string
          id: string
          is_client_visible: boolean
          message: string
          project_id: string
        }
        Insert: {
          author_id?: string | null
          created_at?: string
          id?: string
          is_client_visible?: boolean
          message: string
          project_id: string
        }
        Update: {
          author_id?: string | null
          created_at?: string
          id?: string
          is_client_visible?: boolean
          message?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          client_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          github_owner: string | null
          github_repo: string | null
          id: string
          name: string
          notes: string | null
          priority: Database["public"]["Enums"]["priority_level"]
          progress: number
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
        }
        Insert: {
          budget?: number | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          github_owner?: string | null
          github_repo?: string | null
          id?: string
          name: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["priority_level"]
          progress?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Update: {
          budget?: number | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          github_owner?: string | null
          github_repo?: string | null
          id?: string
          name?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["priority_level"]
          progress?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      activity_type:
        | "note"
        | "email_sent"
        | "email_received"
        | "call"
        | "meeting"
        | "status_change"
        | "task"
      app_role: "admin" | "client"
      lead_status:
        | "new"
        | "outreached"
        | "responded"
        | "qualified"
        | "proposal_sent"
        | "won"
        | "lost"
        | "archived"
      priority_level: "low" | "medium" | "high" | "urgent"
      project_status:
        | "planning"
        | "in_progress"
        | "review"
        | "on_hold"
        | "completed"
        | "cancelled"
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
      activity_type: [
        "note",
        "email_sent",
        "email_received",
        "call",
        "meeting",
        "status_change",
        "task",
      ],
      app_role: ["admin", "client"],
      lead_status: [
        "new",
        "outreached",
        "responded",
        "qualified",
        "proposal_sent",
        "won",
        "lost",
        "archived",
      ],
      priority_level: ["low", "medium", "high", "urgent"],
      project_status: [
        "planning",
        "in_progress",
        "review",
        "on_hold",
        "completed",
        "cancelled",
      ],
    },
  },
} as const
