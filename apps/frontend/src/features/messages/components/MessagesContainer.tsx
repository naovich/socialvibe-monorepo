import React, { useEffect, useRef } from 'react';
import { ArrowLeft, Phone, Video, MoreVertical } from 'lucide-react';
import { useMessages } from '../hooks/useMessages';
import ConversationItem from './ConversationItem';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

interface MessagesContainerProps {
  onClose?: () => void;
}

const MessagesContainer: React.FC<MessagesContainerProps> = ({ onClose }) => {
  const {
    conversations,
    activeConversation,
    messages,
    isLoading,
    selectConversation,
    sendMessage,
    reactToMessage,
  } = useMessages();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string, image?: File) => {
    if (!activeConversation) return;

    await sendMessage({
      conversationId: activeConversation.id,
      text,
      image,
    });
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-bg-primary border border-border-primary rounded-2xl overflow-hidden shadow-lg">
      {/* Conversations List (Left) */}
      <div className="w-96 border-r border-border-primary flex flex-col bg-bg-card">
        {/* Header */}
        <div className="p-4 border-b border-border-primary flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-bg-secondary rounded-full transition-colors lg:hidden"
              >
                <ArrowLeft size={20} className="text-text-muted" />
              </button>
            )}
            <h2 className="text-xl font-bold text-text-primary">Messages</h2>
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {isLoading && conversations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-text-muted">Loading conversations...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-text-muted">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={activeConversation?.id === conv.id}
                onClick={() => selectConversation(conv)}
              />
            ))
          )}
        </div>
      </div>

      {/* Chat Area (Right) */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border-primary flex items-center justify-between bg-bg-card">
            <div className="flex items-center gap-3">
              <img
                src={activeConversation.participants[0].avatar}
                alt={activeConversation.participants[0].name}
                className="w-10 h-10 rounded-full border-2 border-primary"
              />
              <div>
                <h3 className="font-semibold text-text-primary">
                  {activeConversation.participants[0].name}
                </h3>
                <p className="text-sm text-text-muted">
                  {activeConversation.participants[0].isOnline
                    ? 'Active now'
                    : activeConversation.participants[0].lastSeen
                    ? `Last seen ${new Date(activeConversation.participants[0].lastSeen).toLocaleTimeString()}`
                    : 'Offline'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-bg-secondary rounded-full transition-colors">
                <Phone size={20} className="text-text-muted" />
              </button>
              <button className="p-2 hover:bg-bg-secondary rounded-full transition-colors">
                <Video size={20} className="text-text-muted" />
              </button>
              <button className="p-2 hover:bg-bg-secondary rounded-full transition-colors">
                <MoreVertical size={20} className="text-text-muted" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {isLoading && messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {messages.map((message, index) => {
                  const isOwn = message.senderId === 'current-user';
                  const prevMessage = messages[index - 1];
                  const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;

                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={isOwn}
                      showAvatar={showAvatar}
                      senderAvatar={
                        !isOwn ? activeConversation.participants[0].avatar : undefined
                      }
                      senderName={
                        !isOwn ? activeConversation.participants[0].name : undefined
                      }
                      onReact={(emoji) => reactToMessage(message.id, emoji)}
                    />
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <MessageInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-bg-secondary">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 bg-primary-light rounded-full flex items-center justify-center">
              <span className="text-6xl">💬</span>
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-2">Select a conversation</h3>
            <p className="text-text-muted">Choose from your existing conversations or start a new one</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesContainer;
