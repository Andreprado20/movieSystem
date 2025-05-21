import { fetchAPI } from "./api"

export interface ChatMessage {
  id: string
  content: string
  sender_id: string
  sender_name: string
  group_id: string
  created_at: string
  attachments?: {
    type: string
    url: string
  }[]
}

export interface ChatGroup {
  id: string
  name: string
  description: string | null
  is_private: boolean
  created_by: string
  created_at: string
  members: string[]
}

export const chatApi = {
  // Group methods
  async getGroups(): Promise<ChatGroup[]> {
    return fetchAPI("/api/chat/groups")
  },

  async getGroup(groupId: string): Promise<ChatGroup> {
    return fetchAPI(`/api/chat/groups/${groupId}`)
  },

  async createGroup(data: { name: string; description?: string; is_private?: boolean }): Promise<ChatGroup> {
    return fetchAPI("/api/chat/groups", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  async updateGroup(
    groupId: string,
    data: { name?: string; description?: string; is_private?: boolean },
  ): Promise<ChatGroup> {
    return fetchAPI(`/api/chat/groups/${groupId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  async deleteGroup(groupId: string): Promise<{ success: boolean }> {
    return fetchAPI(`/api/chat/groups/${groupId}`, {
      method: "DELETE",
    })
  },

  async joinGroup(groupId: string): Promise<{ success: boolean }> {
    return fetchAPI(`/api/chat/groups/${groupId}/join`, {
      method: "POST",
    })
  },

  async leaveGroup(groupId: string): Promise<{ success: boolean }> {
    return fetchAPI(`/api/chat/groups/${groupId}/leave`, {
      method: "POST",
    })
  },

  // Message methods
  async getMessages(groupId: string, limit = 50, before?: string): Promise<ChatMessage[]> {
    const url = before
      ? `/api/chat/groups/${groupId}/messages?limit=${limit}&before=${before}`
      : `/api/chat/groups/${groupId}/messages?limit=${limit}`
    return fetchAPI(url)
  },

  async sendMessage(
    groupId: string,
    content: string,
    attachments?: { type: string; url: string }[],
  ): Promise<ChatMessage> {
    return fetchAPI(`/api/chat/groups/${groupId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content, attachments }),
    })
  },

  async updateMessage(groupId: string, messageId: string, content: string): Promise<ChatMessage> {
    return fetchAPI(`/api/chat/groups/${groupId}/messages/${messageId}`, {
      method: "PUT",
      body: JSON.stringify({ content }),
    })
  },

  async deleteMessage(groupId: string, messageId: string): Promise<{ success: boolean }> {
    return fetchAPI(`/api/chat/groups/${groupId}/messages/${messageId}`, {
      method: "DELETE",
    })
  },

  // Member methods
  async getMembers(groupId: string): Promise<any[]> {
    return fetchAPI(`/api/chat/groups/${groupId}/members`)
  },

  async addMember(groupId: string, userId: string): Promise<{ success: boolean }> {
    return fetchAPI(`/api/chat/groups/${groupId}/members`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    })
  },

  async removeMember(groupId: string, userId: string): Promise<{ success: boolean }> {
    return fetchAPI(`/api/chat/groups/${groupId}/members/${userId}`, {
      method: "DELETE",
    })
  },
}
