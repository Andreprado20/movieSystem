import { type NextRequest, NextResponse } from "next/server"

// Base URL for the AI comments service
const AI_SERVICE_URL = "https://movie-system-ia-comentario.vercel.app/"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const movieId = searchParams.get("movieId")
  const userId = searchParams.get("userId")
  const type = searchParams.get("type") || "similar"

  try {
    // Determine the endpoint based on the recommendation type
    let endpoint = ""
    switch (type) {
      case "similar":
        endpoint = `api/recommendations/similar/${movieId}`
        break
      case "personalized":
        endpoint = `api/recommendations/personalized?userId=${userId}`
        break
      case "trending":
        endpoint = "api/recommendations/trending"
        break
      case "genre":
        const genreId = searchParams.get("genreId")
        endpoint = `api/recommendations/genre/${genreId}`
        break
      default:
        endpoint = `api/recommendations/similar/${movieId}`
    }

    // Make the request to the AI service
    const response = await fetch(`${AI_SERVICE_URL}/${endpoint}`)

    if (!response.ok) {
      throw new Error(`AI service responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching AI recommendations:", error)
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
  }
}
