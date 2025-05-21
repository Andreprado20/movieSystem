import { createClient } from "@supabase/supabase-js"

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qoplwtzicemqpxytfzoj.supabase.co"
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvcGx3dHppY2VtcXB4eXRmem9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNjk2MjYsImV4cCI6MjA1ODk0NTYyNn0.wYRh1hFXsmJPhZgPWJ1kioTXwioMIW_W-S9OWfnkoII"

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

// User functions
export async function getProfile(userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) throw error
  return data
}

// Forum functions
export async function getForumComments(movieId: string) {
  const { data, error } = await supabase
    .from("forum_comments")
    .select("*")
    .eq("movie_id", movieId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createForumComment(movieId: string, content: string, userId: string) {
  const { data, error } = await supabase
    .from("forum_comments")
    .insert([
      {
        movie_id: movieId,
        content,
        user_id: userId,
      },
    ])
    .select()

  if (error) throw error
  return data?.[0]
}

// Community functions
export async function getCommunities() {
  const { data, error } = await supabase.from("communities").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getCommunity(id: string) {
  const { data, error } = await supabase.from("communities").select("*").eq("id", id).single()

  if (error) throw error
  return data
}
