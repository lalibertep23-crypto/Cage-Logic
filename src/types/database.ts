// Placeholder Database type. After the first migration runs in Supabase,
// regenerate this file with:
//   npx supabase gen types typescript --project-id <ref> --schema public > src/types/database.ts
export type Database = {
  public: {
    Tables: Record<string, { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
