import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Loader } from 'lucide-react';

const ChatHistoryInterface = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = () => {
    // Simulated API response
    const mockData = {
      "chat_transcript": [
        {
          "sender": "ZUS Coffee",
          "sender_type": "bot",
          "message_type": "text",
          "message": "Hi Guest 50419! How can I help you today?",
          "timestamp": "2024-12-27 09:54AM"
        },
        {
          "sender": "User",
          "sender_type": "user",
          "message_type": "text",
          "message": "ada kerja kosong tak?",
          "timestamp": "2024-12-27 09:59AM"
        },
        {
          "sender": "ZUS Coffee",
          "sender_type": "bot",
          "message_type": "text",
          "message": "DEBUG - CAREER NO ORDER ID Adakah saya menjawab soalan anda?",
          "timestamp": "2024-12-27 09:59AM"
        },
        {
          "sender": "User",
          "sender_type": "user",
          "message_type": "text",
          "message": "i nak cakap dengan manusia",
          "timestamp": "2024-12-27 09:59AM"
        },
        {
          "sender": "ZUS Coffee",
          "sender_type": "bot",
          "message_type": "text",
          "message": "DEBUG - LIVE AGENT NO ORDER ID Biarkan saya mencari ejen untuk membantu anda dengan ini.",
          "timestamp": "2024-12-27 09:59AM"
        },
        {
          "sender": "ZUS Coffee",
          "sender_type": "bot",
          "message_type": "text",
          "message": "Resetting conversation and sending bot to standby mode. Thank you. Just say Hi! to start..",
          "timestamp": "2024-12-27 10:06AM"
        },
        {
          "sender": "User",
          "sender_type": "user",
          "message_type": "text",
          "message": "restart got job vacancy",
          "timestamp": "2024-12-27 10:06AM"
        },
        {
          "sender": "ZUS Coffee",
          "sender_type": "bot",
          "message_type": "text",
          "message": "Did I answer your question? DEBUG - CAREER NO ORDER ID",
          "timestamp": "2024-12-27 10:06AM"
        },
        {
          "sender": "User",
          "sender_type": "user",
          "message_type": "text",
          "message": "end the chat",
          "timestamp": "2024-12-27 10:06AM"
        },
        {
          "sender": "ZUS Coffee",
          "sender_type": "bot",
          "message_type": "text",
          "message": "DEBUG - END THE CHAT NO ORDER ID How would you rate the conversation? I'm glad. Please feel free to reach out to me for any further queries.",
          "timestamp": "2024-12-27 10:06AM"
        },
        {
          "sender": "User",
          "sender_type": "user",
          "message_type": "text",
          "message": "⭐⭐⭐⭐⭐",
          "timestamp": "2024-12-27 10:06AM"
        }
      ]
    };

    setTimeout(() => {
      setMessages(mockData.chat_transcript);
      setIsLoading(false);
    }, 1000);
  };

  const formatTimestamp = (timestamp) => {
    // Handle timestamp in format "2024-12-18 11:11pm"
    const [date, time] = timestamp.split(' ');
    const [hours, minutes] = time.slice(0, -2).split(':');
    const period = time.slice(-2);
    
    let hour = parseInt(hours);
    if (period.toLowerCase() === 'pm' && hour !== 12) {
      hour += 12;
    } else if (period.toLowerCase() === 'am' && hour === 12) {
      hour = 0;
    }
    
    return `${hour}:${minutes}`;
  };

  const MessageBubble = ({ message }) => {
    const isBot = message.sender_type === 'bot';
    
    return (
      <div className={`flex ${isBot ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[70%] ${isBot ? 'bg-blue-500 text-white' : 'bg-gray-100'} rounded-lg p-3`}>
          <div className="flex items-center mb-1">
            <span className="font-semibold text-sm">{message.sender}</span>
            <span className="text-xs ml-2 opacity-70">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
          
          {message.message_type === 'text' && (
            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
          )}
          
          {message.message_type === 'image' && (
            <img 
              src={message.message} 
              alt="Chat attachment" 
              className="max-w-full rounded"
            />
          )}
          
          {message.message_type === 'video' && (
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded"
                src={message.message}
                allowFullScreen
              />
            </div>
          )}
          
          {message.message_type === 'audio' && (
            <audio controls className="w-full">
              <source src={message.message} />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Nav Bar */}
      <nav className="flex items-center px-4 py-2 bg-white border-b">
        <img 
          src="https://zuscoffee.com/wp-content/uploads/2022/03/zus_logo.png" 
          alt="Brand Logo" 
          className="h-10 w-10"
        />
        <span className="ml-5 text-lg"><strong>ZUS Coffee</strong> | <small>Chatbot History</small></span>
      </nav>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle className="w-12 h-12 mb-2" />
            <p>{error}</p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <MessageBubble key={index} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatHistoryInterface;