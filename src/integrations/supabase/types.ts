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
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
      complementary_courses: {
        Row: {
          created_at: string
          created_by: string
          description: string
          id: string
          is_active: boolean
          title: string
          updated_at: string | null
          youtube_url: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string | null
          youtube_url: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string | null
          youtube_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "complementary_courses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "class_enrollments_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "complementary_courses_created_by_fkey"
            columns: ["created_by"]
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
      password_resets: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token: string
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "password_resets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "class_enrollments_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "password_resets_user_id_fkey"
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
          p_description: string
          p_name: string
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
          start_date: string
          teacher_name: string
        }[]
      }
      admin_get_courses: {
        Args: Record<PropertyKey, never>
        Returns: {
          class_id: string
          description: string
          is_active: boolean
          name: string
          start_date: string
          students_count: number
          teacher_name: string
        }[]
      }
      admin_get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          active_students_last_week: number
          average_completion_rate: number
          total_classes: number
          total_lessons: number
          total_students: number
          total_teachers: number
        }[]
      }
      admin_get_enrollment_stats: {
        Args: { p_end_date: string; p_start_date: string }
        Returns: {
          enrollment_date: string
          total_enrollments: number
        }[]
      }
      admin_get_payments: {
        Args: Record<PropertyKey, never>
        Returns: {
          amount: number
          course_name: string
          id: string
          payment_date: string
          payment_method: string
          status: string
          student_email: string
          student_name: string
        }[]
      }
      admin_get_revenue_data: {
        Args: {
          p_end_date?: string
          p_group_by?: string
          p_start_date?: string
        }
        Returns: {
          class_id: string
          class_name: string
          month_date: string
          total_revenue: number
          total_students: number
        }[]
      }
      admin_get_student_details: {
        Args: { p_student_id: string }
        Returns: {
          address: string
          birth_date: string
          cpf: string
          created_at: string
          current_classes: Json
          education: string
          email: string
          experience_level: string
          first_name: string
          goals: string
          is_profile_complete: boolean
          last_active: string
          last_name: string
          name: string
          phone: string
          professional_area: string
          progress_average: number
          study_availability: string
          subscription_plan: string
          user_id: string
          whatsapp: string
        }[]
      }
      admin_get_students_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          classes_count: number
          created_at: string
          email: string
          last_active: string
          name: string
          progress_average: number
          user_id: string
        }[]
      }
      admin_get_teacher_details: {
        Args: { p_teacher_id: string }
        Returns: {
          classes: Json
          classes_count: number
          created_at: string
          email: string
          id: string
          name: string
          students_count: number
        }[]
      }
      admin_get_teachers: {
        Args: Record<PropertyKey, never>
        Returns: {
          classes_count: number
          created_at: string
          email: string
          id: string
          name: string
          students_count: number
        }[]
      }
      admin_update_student_data: {
        Args: {
          p_address?: string
          p_birth_date?: string
          p_cpf?: string
          p_education?: string
          p_email?: string
          p_experience_level?: string
          p_first_name?: string
          p_goals?: string
          p_last_name?: string
          p_name?: string
          p_phone?: string
          p_professional_area?: string
          p_student_id: string
          p_study_availability?: string
          p_whatsapp?: string
        }
        Returns: undefined
      }
      admin_update_student_enrollment: {
        Args: { p_class_id: string; p_status: string; p_student_id: string }
        Returns: undefined
      }
      admin_update_student_status: {
        Args: { p_is_active: boolean; p_student_id: string }
        Returns: undefined
      }
      can_access_class: {
        Args: { class_id: string }
        Returns: boolean
      }
      check_class_has_students: {
        Args: { p_class_id: string }
        Returns: boolean
      }
      check_user_exists: {
        Args: { p_email: string }
        Returns: boolean
      }
      cleanup_expired_password_tokens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_class: {
        Args: {
          p_description: string
          p_name: string
          p_start_date: string
          p_teacher_id: string
        }
        Returns: {
          description: string
          id: string
          name: string
          start_date: string
        }[]
      }
      create_complementary_course: {
        Args: {
          p_description: string
          p_teacher_id: string
          p_title: string
          p_youtube_url: string
        }
        Returns: string
      }
      create_lesson: {
        Args: {
          p_class_id: string
          p_date: string
          p_description: string
          p_title: string
          p_visibility: string
          p_youtube_url: string
        }
        Returns: string
      }
      create_password_reset_token: {
        Args: { p_email: string }
        Returns: string
      }
      create_teacher_class: {
        Args: { p_description: string; p_name: string; p_start_date: string }
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
      delete_complementary_course: {
        Args: { p_course_id: string; p_teacher_id: string }
        Returns: undefined
      }
      delete_lesson: {
        Args: { p_lesson_id: string; p_teacher_id: string }
        Returns: undefined
      }
      enroll_student_to_class: {
        Args: { p_class_id: string; p_student_id: string }
        Returns: undefined
      }
      get_all_classes_for_teachers: {
        Args: Record<PropertyKey, never>
        Returns: {
          description: string
          id: string
          is_active: boolean
          name: string
          start_date: string
          students_count: number
          teacher_id: string
          teacher_name: string
        }[]
      }
      get_all_students_for_teachers: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
        }[]
      }
      get_all_students_optimized: {
        Args: { p_teacher_id: string }
        Returns: {
          class_names: string
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
        }[]
      }
      get_my_class_enrollments: {
        Args: Record<PropertyKey, never>
        Returns: {
          class_id: string
          class_name: string
          enrollment_id: string
          student_id: string
          teacher_id: string
        }[]
      }
      get_student_enrollments: {
        Args: Record<PropertyKey, never>
        Returns: {
          class_description: string
          class_id: string
          class_name: string
          enrollment_id: string
          enrollment_status: string
          start_date: string
          teacher_name: string
        }[]
      }
      get_student_lesson_details: {
        Args: { p_student_id: string; p_teacher_id: string }
        Returns: {
          last_watch: string
          lesson_date: string
          lesson_id: string
          lesson_title: string
          progress: number
          status: string
          watch_time_minutes: number
        }[]
      }
      get_student_lessons: {
        Args: { filter_date?: string }
        Returns: {
          class_id: string
          class_name: string
          date: string
          description: string
          id: string
          title: string
          visibility: string
          youtube_url: string
        }[]
      }
      get_student_lessons_brazil_timezone: {
        Args: Record<PropertyKey, never>
        Returns: {
          class_id: string
          class_name: string
          date: string
          description: string
          id: string
          scheduled_at_brazil: string
          title: string
          visibility: string
          youtube_url: string
        }[]
      }
      get_student_notifications: {
        Args: { p_user_id: string }
        Returns: {
          date: string
          id: string
          message: string
          read: boolean
          title: string
        }[]
      }
      get_student_progress: {
        Args: Record<PropertyKey, never> | { student_id: string }
        Returns: {
          last_watched: string
          lesson_id: string
          progress: number
          status: string
          watch_time_minutes: number
        }[]
      }
      get_teacher_classes: {
        Args: { p_teacher_id: string }
        Returns: {
          description: string
          id: string
          name: string
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
      get_teacher_complementary_courses: {
        Args: { p_teacher_id: string }
        Returns: {
          created_at: string
          description: string
          id: string
          is_active: boolean
          title: string
          youtube_url: string
        }[]
      }
      get_teacher_lessons: {
        Args: { teacher_id: string }
        Returns: {
          class_id: string
          class_name: string
          date: string
          description: string
          id: string
          title: string
          visibility: string
          youtube_url: string
        }[]
      }
      get_teacher_student_count: {
        Args: { p_teacher_id: string }
        Returns: number
      }
      get_teacher_student_progress: {
        Args: { p_teacher_id: string }
        Returns: {
          class_name: string
          completed_lessons: number
          email: string
          id: string
          last_activity: string
          name: string
          progress: number
          total_lessons: number
        }[]
      }
      get_teacher_students: {
        Args: { p_teacher_id: string }
        Returns: {
          class_name: string
          email: string
          enrollment_date: string
          name: string
          progress_percentage: number
          student_id: string
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
      reset_password_send_email: {
        Args: { p_email: string }
        Returns: boolean
      }
      reset_password_with_token: {
        Args: { p_new_password: string; p_token: string }
        Returns: boolean
      }
      reset_test_users: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      send_notification_to_all_classes: {
        Args: { p_message: string; p_sender_id: string; p_title: string }
        Returns: undefined
      }
      send_notification_to_class: {
        Args: {
          p_class_id: string
          p_message: string
          p_sender_id: string
          p_title: string
        }
        Returns: undefined
      }
      unenroll_student_from_class: {
        Args: { p_class_id: string; p_student_id: string; p_teacher_id: string }
        Returns: undefined
      }
      update_class: {
        Args: {
          p_class_id: string
          p_description: string
          p_name: string
          p_start_date: string
          p_teacher_id: string
        }
        Returns: undefined
      }
      update_complementary_course: {
        Args: {
          p_course_id: string
          p_description: string
          p_teacher_id: string
          p_title: string
          p_youtube_url: string
        }
        Returns: undefined
      }
      update_lesson: {
        Args: {
          p_class_id: string
          p_date: string
          p_description: string
          p_lesson_id: string
          p_teacher_id: string
          p_title: string
          p_visibility: string
          p_youtube_url: string
        }
        Returns: undefined
      }
      update_user_profile: {
        Args: { p_bio?: string; p_name?: string; p_user_id: string }
        Returns: undefined
      }
      upsert_lesson_progress: {
        Args: {
          p_lesson_id: string
          p_progress: number
          p_status: string
          p_student_id: string
          p_watch_time_minutes: number
        }
        Returns: undefined
      }
      user_can_access_class: {
        Args: { class_id: string }
        Returns: boolean
      }
      validate_cpf: {
        Args: { p_cpf: string }
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
    Enums: {},
  },
} as const
