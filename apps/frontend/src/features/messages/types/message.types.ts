export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  image?: string;
  file?: {
    name: string;
    url: string;
    type: string;
    size: number;
  };
  reactions?: {
    emoji: string;
    userId: string;
  }[];
  status: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: string; // Message ID
  createdAt: string;
  updatedAt?: string;
}

export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  isTyping?: boolean;
  typingUser?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationParticipant {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface SendMessageData {
  conversationId: string;
  text?: string;
  image?: File;
  file?: File;
  replyTo?: string;
}

export interface MessagesState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Record<string, Message[]>; // conversationId -> messages[]
  isLoading: boolean;
  error: string | null;
}
