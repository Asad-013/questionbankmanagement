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
            users: {
                Row: {
                    id: string
                    email: string
                    role: Database["public"]["Enums"]["user_role"]
                    email_verified: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    email: string
                    role?: Database["public"]["Enums"]["user_role"]
                    email_verified?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    role?: Database["public"]["Enums"]["user_role"]
                    email_verified?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            departments: {
                Row: {
                    id: string
                    code: string
                    name: string
                    description: string | null
                    active: boolean
                }
                Insert: {
                    id?: string
                    code: string
                    name: string
                    description?: string | null
                    active?: boolean
                }
                Update: {
                    id?: string
                    code?: string
                    name?: string
                    description?: string | null
                    active?: boolean
                }
            }
            exam_names: {
                Row: {
                    id: string
                    name: string
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            courses: {
                Row: {
                    id: string
                    code: string
                    title: string
                    department_id: string | null
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    code: string
                    title: string
                    department_id?: string | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    code?: string
                    title?: string
                    department_id?: string | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            questions: {
                Row: {
                    id: string
                    image_url: string
                    thumbnail_url: string | null
                    exam_year: number
                    session: Database["public"]["Enums"]["session_enum"] | null
                    department_id: string | null
                    exam_name_id: string | null
                    course_id: string | null
                    course_code: string | null
                    description: string | null
                    tags: string[] | null
                    status: Database["public"]["Enums"]["question_status"]
                    rejection_reason: string | null
                    created_by: string | null
                    reviewed_by: string | null
                    created_at: string
                    updated_at: string
                    reviewed_at: string | null
                }
                Insert: {
                    id?: string
                    image_url: string
                    thumbnail_url?: string | null
                    exam_year: number
                    session?: Database["public"]["Enums"]["session_enum"] | null
                    department_id?: string | null
                    exam_name_id?: string | null
                    course_code?: string | null
                    description?: string | null
                    tags?: string[] | null
                    status?: Database["public"]["Enums"]["question_status"]
                    rejection_reason?: string | null
                    created_by?: string | null
                    reviewed_by?: string | null
                    created_at?: string
                    updated_at?: string
                    reviewed_at?: string | null
                }
                Update: {
                    id?: string
                    image_url?: string
                    thumbnail_url?: string | null
                    exam_year?: number
                    session?: Database["public"]["Enums"]["session_enum"] | null
                    department_id?: string | null
                    exam_name_id?: string | null
                    course_code?: string | null
                    description?: string | null
                    tags?: string[] | null
                    status?: Database["public"]["Enums"]["question_status"]
                    rejection_reason?: string | null
                    created_by?: string | null
                    reviewed_by?: string | null
                    created_at?: string
                    updated_at?: string
                    reviewed_at?: string | null
                }
            }
            content_blocks: {
                Row: {
                    id: string
                    key: string
                    type: Database["public"]["Enums"]["content_type"]
                    title: string | null
                    content: Json
                    metadata: Json | null
                    version: number
                    published: boolean
                    updated_by: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    key: string
                    type: Database["public"]["Enums"]["content_type"]
                    title?: string | null
                    content: Json
                    metadata?: Json | null
                    version?: number
                    published?: boolean
                    updated_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    key?: string
                    type?: Database["public"]["Enums"]["content_type"]
                    title?: string | null
                    content?: Json
                    metadata?: Json | null
                    version?: number
                    published?: boolean
                    updated_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            events_notices: {
                Row: {
                    id: string
                    type: Database["public"]["Enums"]["notice_type"]
                    title: string
                    content: string
                    priority: number
                    event_date: string | null
                    event_time: string | null
                    location: string | null
                    expiry_date: string | null
                    published: boolean
                    created_by: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    type: Database["public"]["Enums"]["notice_type"]
                    title: string
                    content: string
                    priority?: number
                    event_date?: string | null
                    event_time?: string | null
                    location?: string | null
                    expiry_date?: string | null
                    published?: boolean
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    type?: Database["public"]["Enums"]["notice_type"]
                    title?: string
                    content?: string
                    priority?: number
                    event_date?: string | null
                    event_time?: string | null
                    location?: string | null
                    expiry_date?: string | null
                    published?: boolean
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            moderation_log: {
                Row: {
                    id: string
                    question_id: string | null
                    moderator_id: string | null
                    action: Database["public"]["Enums"]["moderation_action"]
                    reason: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    question_id?: string | null
                    moderator_id?: string | null
                    action: Database["public"]["Enums"]["moderation_action"]
                    reason?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    question_id?: string | null
                    moderator_id?: string | null
                    action?: Database["public"]["Enums"]["moderation_action"]
                    reason?: string | null
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            user_role: "student" | "moderator" | "admin"
            question_status: "pending" | "approved" | "rejected" | "flagged"
            session_enum: "Spring" | "Summer" | "Fall" | "Winter"
            content_type: "rich_text" | "structured_list" | "key_value" | "event_list" | "notice_board"
            notice_type: "event" | "announcement" | "deadline" | "update"
            moderation_action: "approved" | "rejected" | "flagged" | "deleted"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
