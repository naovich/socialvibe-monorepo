import { useState, useEffect, useCallback } from 'react';
import type { Conversation, Message, SendMessageData } from '../types/message.types';
import { messagesService } from '../services/messagesService';

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const convs = await messagesService.getConversations();
      setConversations(convs);
    } catch (err) {
      setError('Failed to load conversations');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    setIsLoading(true);
    try {
      const msgs = await messagesService.getMessages(conversationId);
      setMessages(msgs);
      await messagesService.markAsRead(conversationId);
      
      // Update unread count in conversations
      setConversations(prev => prev.map(c => 
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ));
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectConversation = useCallback(async (conversation: Conversation) => {
    setActiveConversation(conversation);
    await loadMessages(conversation.id);
  }, [loadMessages]);

  const sendMessage = useCallback(async (data: SendMessageData) => {
    try {
      const newMessage = await messagesService.sendMessage(data);
      setMessages(prev => [...prev, newMessage]);

      // Update conversation last message
      setConversations(prev => prev.map(c => 
        c.id === data.conversationId 
          ? { ...c, lastMessage: newMessage, updatedAt: newMessage.createdAt }
          : c
      ));
    } catch (err) {
      console.error('Failed to send message:', err);
      throw err;
    }
  }, []);

  const deleteMessage = useCallback(async (messageId: string) => {
    if (!activeConversation) return;

    try {
      await messagesService.deleteMessage(messageId, activeConversation.id);
      setMessages(prev => prev.filter(m => m.id !== messageId));
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  }, [activeConversation]);

  const reactToMessage = useCallback(async (messageId: string, emoji: string) => {
    if (!activeConversation) return;

    // Optimistic update
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const existing = reactions.find(r => r.userId === 'current-user');
        
        if (existing && existing.emoji === emoji) {
          return { ...msg, reactions: reactions.filter(r => r.userId !== 'current-user') };
        } else if (existing) {
          return { 
            ...msg, 
            reactions: reactions.map(r => 
              r.userId === 'current-user' ? { ...r, emoji } : r
            ) 
          };
        } else {
          return { ...msg, reactions: [...reactions, { emoji, userId: 'current-user' }] };
        }
      }
      return msg;
    }));

    try {
      await messagesService.reactToMessage(messageId, activeConversation.id, emoji);
    } catch (err) {
      console.error('Failed to react:', err);
      // Rollback handled by reload
      await loadMessages(activeConversation.id);
    }
  }, [activeConversation, loadMessages]);

  // Initial load
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    activeConversation,
    messages,
    isLoading,
    error,
    selectConversation,
    sendMessage,
    deleteMessage,
    reactToMessage,
    refreshConversations: loadConversations,
  };
};
