export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      volunteers: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          interest: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          interest?: string;
          message?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          interest?: string;
          message?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      donations: {
        Row: {
          id: string;
          name: string;
          email: string;
          amount: number;
          status: "pending" | "completed";
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          amount: number;
          status?: "pending" | "completed";
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          amount?: number;
          status?: "pending" | "completed";
          created_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          title: string;
          date: string;
          location: string;
          description: string;
          image: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          date: string;
          location: string;
          description: string;
          image?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          date?: string;
          location?: string;
          description?: string;
          image?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      event_registrations: {
        Row: {
          id: string;
          event_id: string;
          event_title: string;
          name: string;
          email: string;
          phone: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          event_title: string;
          name: string;
          email: string;
          phone: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          event_title?: string;
          name?: string;
          email?: string;
          phone?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      gallery_images: {
        Row: {
          id: string;
          src: string;
          alt: string;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          src: string;
          alt: string;
          category?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          src?: string;
          alt?: string;
          category?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      stories: {
        Row: {
          id: string;
          title: string;
          location: string;
          programme: string;
          image: string;
          tagline: string;
          before_text: string;
          after_text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          location?: string;
          programme: string;
          image: string;
          tagline: string;
          before_text: string;
          after_text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          location?: string;
          programme?: string;
          image?: string;
          tagline?: string;
          before_text?: string;
          after_text?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
