import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, MoreVertical, Phone, Video } from 'lucide-react';
import { messagesAPI } from '../services/api';
import { useSocialStore } from '../store';
import { socketService } from '../services/socket';

interface Message {
  id: string;
  text: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
}

interface Conversation {
  id: string;
  messages: Message[];
  participants: Array<{
    id: string;
    name: string;
    username: string;
    avatar: string;
  }>;
}

const Chat: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useSocialStore();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherUser = conversation?.participants.find((p) => p.id !== currentUser?.id);

  useEffect(() => {
    const loadConversation = async () => {
      if (!conversationId) return;

      try {
        const data = await messagesAPI.getMessages(conversationId);
        setConversation(data);
        setMessages(data.messages);
      } catch (error) {
        console.error('Failed to load conversation:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [conversationId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Listen for new messages via WebSocket
    const handleNewMessage = (rawData: unknown) => {
      const data = rawData as { conversationId: string; message: Message };
      if (data.conversationId === conversationId) {
        setMessages((prev) => [...prev, data.message]);
      }
    };

    socketService.on('message:new', handleNewMessage);

    return () => {
      socketService.off('message:new', handleNewMessage);
    };
  }, [conversationId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !conversationId || sending) return;

    try {
      setSending(true);
      const message = await messagesAPI.sendMessage(conversationId, newMessage.trim());
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date: string) => {
    const msgDate = new Date(date);
    return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!conversation || !otherUser) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Conversation not found</p>
          <button onClick={() => navigate('/messages')} className="mt-4 text-orange-500 hover:underline">
            Back to messages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#050505] text-white flex flex-col">
      {/* Header */}
      <div className="bg-[#1a1a1a]/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center gap-4">
        <button
          onClick={() => navigate('/messages')}
          className="p-2 hover:bg-white/5 rounded-full transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div 
          onClick={() => navigate(`/user/${otherUser.id}`)}
          className="flex items-center gap-3 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img src={otherUser.avatar} alt={otherUser.name} className="w-10 h-10 rounded-full" />
          <div>
            <h2 className="font-bold">{otherUser.name}</h2>
            <p className="text-xs text-gray-400">@{otherUser.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/5 rounded-full transition-all">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-full transition-all">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-full transition-all">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwn = msg.sender.id === currentUser?.id;
            const showAvatar = index === 0 || messages[index - 1].sender.id !== msg.sender.id;

            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} gap-2`}
              >
                {!isOwn && showAvatar && (
                  <img src={msg.sender.avatar} alt={msg.sender.name} className="w-8 h-8 rounded-full" />
                )}
                {!isOwn && !showAvatar && <div className="w-8" />}

                <div className={`max-w-[70%] ${isOwn ? 'order-first' : ''}`}>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isOwn
                        ? 'bg-orange-500 text-white rounded-br-sm'
                        : 'bg-white/10 text-white rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                  </div>
                  <p className={`text-[10px] text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="bg-[#1a1a1a]/80 backdrop-blur-md border-t border-white/10 px-4 py-4"
      >
        <div className="flex items-end gap-3">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-orange-500/50 transition-all">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none"
              style={{ minHeight: '24px', maxHeight: '120px' }}
            />
          </div>

          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-full transition-all flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
