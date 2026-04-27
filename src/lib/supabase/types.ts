/**
 * Hand-written database types matching `supabase/migrations/0001_init.sql`.
 *
 * Once the project is provisioned, regenerate via:
 *   npx supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts
 */
export type ProfileRole = "buyer" | "seller" | "admin";

export type SellerStatus =
  | "pending_review"
  | "verified"
  | "rejected"
  | "suspended";

export type KycDocKind =
  | "nid_front"
  | "nid_back"
  | "selfie"
  | "trade_license"
  | "tin";

export type KycReviewDecision = "approved" | "rejected" | "needs_more_info";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          role: ProfileRole;
          email_verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          role?: ProfileRole;
          email_verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: ProfileRole;
          email_verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sellers: {
        Row: {
          id: string;
          user_id: string;
          display_name: string;
          handle: string;
          bio: string | null;
          location: string | null;
          nid_number: string | null;
          status: SellerStatus;
          submitted_at: string;
          reviewed_at: string | null;
          reviewer_id: string | null;
          rejection_reason: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          display_name: string;
          handle: string;
          bio?: string | null;
          location?: string | null;
          nid_number?: string | null;
          status?: SellerStatus;
          submitted_at?: string;
          reviewed_at?: string | null;
          reviewer_id?: string | null;
          rejection_reason?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          display_name?: string;
          handle?: string;
          bio?: string | null;
          location?: string | null;
          nid_number?: string | null;
          status?: SellerStatus;
          submitted_at?: string;
          reviewed_at?: string | null;
          reviewer_id?: string | null;
          rejection_reason?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "sellers_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      kyc_documents: {
        Row: {
          id: string;
          user_id: string;
          seller_id: string | null;
          kind: KycDocKind;
          storage_path: string;
          mime: string;
          size_bytes: number;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          seller_id?: string | null;
          kind: KycDocKind;
          storage_path: string;
          mime: string;
          size_bytes: number;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          seller_id?: string | null;
          kind?: KycDocKind;
          storage_path?: string;
          mime?: string;
          size_bytes?: number;
          uploaded_at?: string;
        };
        Relationships: [];
      };
      kyc_reviews: {
        Row: {
          id: string;
          seller_id: string;
          reviewer_id: string;
          decision: KycReviewDecision;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          reviewer_id: string;
          decision: KycReviewDecision;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          seller_id?: string;
          reviewer_id?: string;
          decision?: KycReviewDecision;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      auth_audit_log: {
        Row: {
          id: number;
          user_id: string | null;
          event: string;
          ip: string | null;
          user_agent: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id?: string | null;
          event: string;
          ip?: string | null;
          user_agent?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string | null;
          event?: string;
          ip?: string | null;
          user_agent?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      profile_role: ProfileRole;
      seller_status: SellerStatus;
      kyc_doc_kind: KycDocKind;
      kyc_review_decision: KycReviewDecision;
    };
  };
};
