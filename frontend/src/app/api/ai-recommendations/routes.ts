import { type NextRequest, NextResponse } from "next/server"

// Get the AI service URL from environment variables
const AI_SERVICE_URL = "http://localhost:8000"

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()

    // Make sure we have a question
    if (!body.pergunta) {
      return NextResponse.json({ error: "A pergunta é obrigatória" }, { status: 400 })
    }

    // Forward the request to the Python microservice
    const response = await fetch(`${AI_SERVICE_URL}/responder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pergunta: body.pergunta }),
    })

    // Check if the request was successful
    if (!response.ok) {
      console.error(`Error from AI service: ${response.status} ${response.statusText}`)
      return NextResponse.json({ error: "Erro ao obter recomendações do serviço de IA" }, { status: response.status })
    }

    // Parse and return the response
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error processing AI recommendation request:", error)
    return NextResponse.json({ error: "Erro interno ao processar a solicitação" }, { status: 500 })
  }
}
