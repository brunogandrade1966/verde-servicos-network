// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://saftjhorgslyelayykrm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhZnRqaG9yZ3NseWVsYXl5a3JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTQyNTksImV4cCI6MjA2NTQ5MDI1OX0.9ebkVibA5kiBduhFp2aCZs1hD-BjCLxm7_OVo4S9cSk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);