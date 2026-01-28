import type { Conversation, Message, SendMessageData } from '../types/message.types';
import { mockConversations, mockMessagesByConversation } from '../mock/mockMessages';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MessagesService {
  private conversations: Conversation[] = [...mockConversations];
  private messagesByConv: Record<string, Message[]> = { ...mockMessagesByConversation };

  async getConversations(): Promise<Conversation[]> {
    await delay(300);
    return this.conversations.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    await delay(400);
    return this.messagesByConv[conversationId] || [];
  }

  async sendMessage(data: SendMessageData): Promise<Message> {
    await delay(500);

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: data.conversationId,
      senderId: 'current-user',
      text: data.text || '',
      image: data.image ? URL.createObjectURL(data.image) : undefined,
      status: 'sent',
      createdAt: new Date().toISOString(),
    };

    // Add to messages
    if (!this.messagesByConv[data.conversationId]) {
      this.messagesByConv[data.conversationId] = [];
    }
    this.messagesByConv[data.conversationId].push(newMessage);

    // Update conversation
    const conv = this.conversations.find(c => c.id === data.conversationId);
    if (conv) {
      conv.lastMessage = newMessage;
      conv.updatedAt = new Date().toISOString();
    }

    return newMessage;
  }

  async deleteMessage(messageId: string, conversationId: string): Promise<void> {
    await delay(300);

    const messages = this.messagesByConv[conversationId];
    if (messages) {
      const index = messages.findIndex(m => m.id === messageId);
      if (index !== -1) {
        messages.splice(index, 1);
      }
    }
  }

  async reactToMessage(messageId: string, conversationId: string, emoji: string): Promise<void> {
    await delay(200);

    const messages = this.messagesByConv[conversationId];
    if (messages) {
      const message = messages.find(m => m.id === messageId);
      if (message) {
        if (!message.reactions) {
          message.reactions = [];
        }

        const existingReaction = message.reactions.find(r => r.userId === 'current-user');
        if (existingReaction) {
          if (existingReaction.emoji === emoji) {
            // Remove reaction
            message.reactions = message.reactions.filter(r => r.userId !== 'current-user');
          } else {
            // Change reaction
            existingReaction.emoji = emoji;
          }
        } else {
          // Add reaction
          message.reactions.push({ emoji, userId: 'current-user' });
        }
      }
    }
  }

  async markAsRead(conversationId: string): Promise<void> {
    await delay(100);

    const conv = this.conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.unreadCount = 0;
    }

    const messages = this.messagesByConv[conversationId];
    if (messages) {
      messages.forEach(msg => {
        if (msg.senderId !== 'current-user') {
          msg.status = 'read';
        }
      });
    }
  }

  setTyping(conversationId: string, isTyping: boolean): void {
    const conv = this.conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.isTyping = isTyping;
      if (isTyping) {
        conv.typingUser = conv.participants[0]?.name;
      }
    }
  }
}

export const messagesService = new MessagesService();
