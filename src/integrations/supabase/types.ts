export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      classes: {
        Row: {
          created_at: string
          description: string
          id: string
          is_active: boolean
          name: string
          start_date: string
          teacher_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          name: string
          start_date: string
          teacher_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          name?: string
          start_date?: string
          teacher_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "class_enrollments_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "classes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          class_id: string
          created_at: string
          enrollment_date: string
          id: string
          status: string
          student_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          class_id: string
          created_at?: string
          enrollment_date?: string
          id?: string
          status: string
          student_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          class_id?: string
          created_at?: string
          enrollment_date?: string
          id?: string
          status?: string
          student_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "class_enrollments_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          created_at: string
          id: string
          last_watched: string | null
          lesson_id: string
          progress: number
          status: string
          student_id: string
          updated_at: string | null
          watch_time_minutes: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_watched?: string | null
          lesson_id: string
          progress?: number
          status: string
          student_id: string
          updated_at?: string | null
          watch_time_minutes?: number
        }
        Update: {
          created_at?: string
          id?: string
          last_watched?: string | null
          lesson_id?: string
          progress?: number
          status?: string
          student_id?: string
          updated_at?: string | null
          watch_time_minutes?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "class_enrollments_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "lesson_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          class_id: string | null
          created_at: string
          date: string
          description: string
          id: string
          order: number | null
          title: string
          updated_at: string | null
          visibility: string
          youtube_url: string
        }
        Insert: {
          class_id?: string | null
          created_at?: string
          date: string
          description: string
          id?: string
          order?: number | null
          title: string
          updated_at?: string | null
          visibility: string
          youtube_url: string
        }
        Update: {
          class_id?: string | null
          created_at?: string
          date?: string
          description?: string
          id?: string
          order?: number | null
          title?: string
          updated_at?: string | null
          visibility?: string
          youtube_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          date: string
          id: string
          message: string
          read: boolean
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          message: string
          read?: boolean
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "class_enrollments_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      student_applications: {
        Row: {
          course: string
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          course: string
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          course?: string
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      student_documents: {
        Row: {
          application_id: string
          file_url: string
          id: string
          name: string
          uploaded_at: string | null
        }
        Insert: {
          application_id: string
          file_url: string
          id?: string
          name: string
          uploaded_at?: string | null
        }
        Update: {
          application_id?: string
          file_url?: string
          id?: string
          name?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "student_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      user_payments: {
        Row: {
          application_id: string | null
          created_at: string
          id: string
          payment_amount: number | null
          payment_date: string | null
          payment_method: string | null
          payment_status: string
          stripe_payment_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          application_id?: string | null
          created_at?: string
          id?: string
          payment_amount?: number | null
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string
          stripe_payment_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          application_id?: string | null
          created_at?: string
          id?: string
          payment_amount?: number | null
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string
          stripe_payment_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_payments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "student_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          address: string | null
          birth_date: string | null
          cpf: string | null
          created_at: string | null
          education: string | null
          experience_level: string | null
          first_name: string | null
          gender: string | null
          goals: string | null
          id: string
          is_profile_complete: boolean | null
          last_name: string | null
          phone: string | null
          professional_area: string | null
          referral: string | null
          study_availability: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          cpf?: string | null
          created_at?: string | null
          education?: string | null
          experience_level?: string | null
          first_name?: string | null
          gender?: string | null
          goals?: string | null
          id: string
          is_profile_complete?: boolean | null
          last_name?: string | null
          phone?: string | null
          professional_area?: string | null
          referral?: string | null
          study_availability?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          cpf?: string | null
          created_at?: string | null
          education?: string | null
          experience_level?: string | null
          first_name?: string | null
          gender?: string | null
          goals?: string | null
          id?: string
          is_profile_complete?: boolean | null
          last_name?: string | null
          phone?: string | null
          professional_area?: string | null
          referral?: string | null
          study_availability?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean | null
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          id?: string
          is_active?: boolean | null
          name: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      class_enrollments_view: {
        Row: {
          class_id: string | null
          class_name: string | null
          enrollment_id: string | null
          student_email: string | null
          student_id: string | null
          teacher_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "class_enrollments_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "classes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      activate_student_account: {
        Args: { user_id: string }
        Returns: boolean
      }
      admin_create_class: {
        Args: {
          p_name: string
          p_description: string
          p_start_date: string
          p_teacher_id: string
        }
        Returns: string
      }
      admin_create_professor: {
        Args: { p_email: string; p_name: string; p_password: string }
        Returns: string
      }
      admin_create_teacher: {
        Args: { p_email: string; p_name: string; p_password: string }
        Returns: string
      }
      admin_delete_student: {
        Args: { p_student_id: string }
        Returns: undefined
      }
      admin_get_active_students_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      admin_get_all_classes: {
        Args: Record<PropertyKey, never>
        Returns: {
          class_id: string
          class_name: string
          teacher_name: string
          start_date: string
        }[]
      }
      admin_get_courses: {
        Args: Record<PropertyKey, never>
        Returns: {
          class_id: string
          name: string
          description: string
          start_date: string
          teacher_name: string
          students_count: number
          is_active: boolean
        }[]
      }
      admin_get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_students: number
          total_teachers: number
          total_classes: number
          active_students_last_week: number
          total_lessons: number
          average_completion_rate: number
        }[]
      }
      admin_get_enrollment_stats: {
        Args: { p_start_date: string; p_end_date: string }
        Returns: {
          enrollment_date: string
          total_enrollments: number
        }[]
      }
      admin_get_payments: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          student_name: string
          student_email: string
          course_name: string
          amount: number
          payment_date: string
          payment_method: string
          status: string
        }[]
      }
      admin_get_revenue_data: {
        Args: {
          p_group_by?: string
          p_start_date?: string
          p_end_date?: string
        }
        Returns: {
          class_id: string
          class_name: string
          total_revenue: number
          total_students: number
          month_date: string
        }[]
      }
      admin_get_student_details: {
        Args: { p_student_id: string }
        Returns: {
          user_id: string
          name: string
          email: string
          created_at: string
          current_classes: Json
          subscription_plan: string
          progress_average: number
          last_active: string
          first_name: string
          last_name: string
          phone: string
          whatsapp: string
          cpf: string
          birth_date: string
          address: string
          education: string
          professional_area: string
          experience_level: string
          goals: string
          study_availability: string
          is_profile_complete: boolean
        }[]
      }
      admin_get_students_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          name: string
          email: string
          created_at: string
          classes_count: number
          last_active: string
          progress_average: number
        }[]
      }
      admin_get_teachers: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          email: string
          created_at: string
          classes_count: number
          students_count: number
        }[]
      }
      admin_update_student_enrollment: {
        Args: { p_student_id: string; p_class_id: string; p_status: string }
        Returns: undefined
      }
      admin_update_student_status: {
        Args: { p_student_id: string; p_is_active: boolean }
        Returns: undefined
      }
      can_access_class: {
        Args: { class_id: string }
        Returns: boolean
      }
      check_user_exists: {
        Args: { p_email: string }
        Returns: boolean
      }
      create_class: {
        Args: {
          p_name: string
          p_description: string
          p_start_date: string
          p_teacher_id: string
        }
        Returns: {
          id: string
          name: string
          description: string
          start_date: string
        }[]
      }
      create_lesson: {
        Args: {
          p_title: string
          p_description: string
          p_youtube_url: string
          p_date: string
          p_class_id: string
          p_visibility: string
        }
        Returns: string
      }
      create_teacher_class: {
        Args: { p_name: string; p_description: string; p_start_date: string }
        Returns: string
      }
      create_test_users: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      delete_class: {
        Args: { p_class_id: string; p_teacher_id: string }
        Returns: undefined
      }
      delete_lesson: {
        Args: { p_lesson_id: string; p_teacher_id: string }
        Returns: undefined
      }
      get_all_classes_for_teachers: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          description: string
          start_date: string
          teacher_id: string
          teacher_name: string
          students_count: number
          is_active: boolean
        }[]
      }
      get_all_students_for_teachers: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          email: string
          created_at: string
          is_active: boolean
        }[]
      }
      get_my_class_enrollments: {
        Args: Record<PropertyKey, never>
        Returns: {
          enrollment_id: string
          class_id: string
          class_name: string
          teacher_id: string
          student_id: string
        }[]
      }
      get_student_enrollments: {
        Args: Record<PropertyKey, never>
        Returns: {
          enrollment_id: string
          class_id: string
          class_name: string
          class_description: string
          start_date: string
          enrollment_status: string
          teacher_name: string
        }[]
      }
      get_student_lessons: {
        Args: { filter_date?: string }
        Returns: {
          id: string
          title: string
          description: string
          youtube_url: string
          date: string
          class_id: string
          class_name: string
          visibility: string
        }[]
      }
      get_student_notifications: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          title: string
          message: string
          date: string
          read: boolean
        }[]
      }
      get_student_progress: {
        Args: Record<PropertyKey, never> | { student_id: string }
        Returns: {
          lesson_id: string
          watch_time_minutes: number
          progress: number
          last_watched: string
          status: string
        }[]
      }
      get_teacher_classes: {
        Args: { p_teacher_id: string }
        Returns: {
          id: string
          name: string
          description: string
          start_date: string
          students_count: number
        }[]
      }
      get_teacher_classes_simple: {
        Args: { teacher_id: string }
        Returns: {
          id: string
          name: string
        }[]
      }
      get_teacher_lessons: {
        Args: { teacher_id: string }
        Returns: {
          id: string
          title: string
          description: string
          youtube_url: string
          date: string
          class_id: string
          class_name: string
          visibility: string
        }[]
      }
      get_teacher_student_count: {
        Args: { p_teacher_id: string }
        Returns: number
      }
      get_teacher_student_progress: {
        Args: { p_teacher_id: string }
        Returns: {
          id: string
          name: string
          email: string
          class_name: string
          last_activity: string
          completed_lessons: number
          total_lessons: number
          progress: number
        }[]
      }
      get_teacher_students: {
        Args: { p_teacher_id: string }
        Returns: {
          student_id: string
          name: string
          email: string
          class_name: string
          enrollment_date: string
          progress_percentage: number
        }[]
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      get_user_role_for_policy: {
        Args: { user_id: string }
        Returns: string
      }
      get_user_role_safe: {
        Args: { user_id: string }
        Returns: string
      }
      mark_notification_as_read: {
        Args: { p_notification_id: string }
        Returns: boolean
      }
      reset_test_users: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_class: {
        Args: {
          p_class_id: string
          p_name: string
          p_description: string
          p_start_date: string
          p_teacher_id: string
        }
        Returns: undefined
      }
      update_lesson: {
        Args: {
          p_lesson_id: string
          p_title: string
          p_description: string
          p_youtube_url: string
          p_date: string
          p_class_id: string
          p_visibility: string
          p_teacher_id: string
        }
        Returns: undefined
      }
      upsert_lesson_progress: {
        Args: {
          p_lesson_id: string
          p_student_id: string
          p_watch_time_minutes: number
          p_progress: number
          p_status: string
        }
        Returns: undefined
      }
      user_can_access_class: {
        Args: { class_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
