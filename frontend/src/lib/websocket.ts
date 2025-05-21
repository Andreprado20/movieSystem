import { getFirebaseToken } from "./firebase"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Convert http/https to ws/wss
export function getWebSocketUrl(url: string): string {
  return url.replace(/^http/, "ws")
}

export class ChatWebSocket {
  private socket: WebSocket | null = null
  private groupId: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectTimeout: NodeJS.Timeout | null = null
  private listeners: { [key: string]: ((data: any) => void)[] } = {}

  constructor(groupId: string) {
    this.groupId = groupId
  }

  async connect(): Promise<void> {
    try {
      // Get Firebase token for authentication
      const token = await getFirebaseToken()

      // Create WebSocket URL with token
      const wsUrl = `${getWebSocketUrl(API_URL)}/api/v1/chat/ws/${this.groupId}?token=${token}`

      // Create WebSocket connection
      this.socket = new WebSocket(wsUrl)

      // Set up event handlers
      this.socket.onopen = this.handleOpen.bind(this)
      this.socket.onmessage = this.handleMessage.bind(this)
      this.socket.onclose = this.handleClose.bind(this)
      this.socket.onerror = this.handleError.bind(this)

      // Reset reconnect attempts on successful connection
      this.reconnectAttempts = 0
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error)
      this.attemptReconnect()
    }
  }

  private handleOpen(event: Event): void {
    console.log("WebSocket connected")
    this.emit("connected", {})
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data)
      this.emit("message", data)
    } catch (error) {
      console.error("Error parsing WebSocket message:", error)
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log("WebSocket closed:", event.code, event.reason)
    this.emit("disconnected", { code: event.code, reason: event.reason })

    // Attempt to reconnect if not closed cleanly
    if (event.code !== 1000) {
      this.attemptReconnect()
    }
  }

  private handleError(event: Event): void {
    console.error("WebSocket error:", event)
    this.emit("error", event)
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnect attempts reached")
      this.emit("reconnect_failed", {})
      return
    }

    this.reconnectAttempts++

    // Exponential backoff for reconnect
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`)

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }

    this.reconnectTimeout = setTimeout(() => {
      this.emit("reconnecting", { attempt: this.reconnectAttempts })
      this.connect()
    }, delay)
  }

  sendMessage(content: string): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected")
      return
    }

    const message = {
      content,
    }

    this.socket.send(JSON.stringify(message))
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close(1000, "User disconnected")
      this.socket = null
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
  }

  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  off(event: string, callback: (data: any) => void): void {
    if (!this.listeners[event]) return

    this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback)
  }

  private emit(event: string, data: any): void {
    if (!this.listeners[event]) return

    this.listeners[event].forEach((callback) => {
      try {
        callback(data)
      } catch (error) {
        console.error(`Error in ${event} listener:`, error)
      }
    })
  }
}
