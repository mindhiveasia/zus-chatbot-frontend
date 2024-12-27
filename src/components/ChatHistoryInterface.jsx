import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { MessageCircle, Loader } from 'lucide-react';

const ChatHistoryInterface = () => {
  const { param1 } = useParams();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMessages(param1);
  }, [param1]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async (param) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/chat_orders/chat_history/${param}`);
      const result = await response.json();

      if (result.status === 'success') {
        const chatData = JSON.parse(result.data);
        setMessages(chatData.chat_transcript);
      } else {
        setError(result.message || 'Failed to fetch messages');
      }
    } catch (err) {
      setError('An error occurred while fetching messages');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const [date, time] = timestamp.split(' ');
    const [hours, minutes] = time.slice(0, -2).split(':');
    const period = time.slice(-2);
    let hour = parseInt(hours);
    if (period.toLowerCase() === 'pm' && hour !== 12) hour += 12;
    else if (period.toLowerCase() === 'am' && hour === 12) hour = 0;
    return `${hour}:${minutes}`;
  };

  const formatDate = (timestamp) => {
    const [date] = timestamp.split(' ');
    const [year, month, day] = date.split('-');
    const formattedDate = new Date(year, month - 1, day);
    return formattedDate.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const groupMessagesByDate = (messages) => {
    const grouped = [];
    let currentDate = null;

    messages.forEach((msg) => {
      const messageDate = msg.timestamp.split(' ')[0]; // Extract date part
      if (currentDate !== messageDate) {
        grouped.push({ type: 'date-label', date: messageDate });
        currentDate = messageDate;
      }
      grouped.push({ type: 'message', message: msg });
    });

    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages);

  const MessageBubble = ({ message }) => {
    const isBot = message.sender_type === 'bot';
    return (
      <div className={`flex ${isBot ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[70%] ${isBot ? 'bg-blue-500 text-white' : 'bg-gray-100'} rounded-lg p-3`}>
          <div className="flex items-center mb-1">
            <span className="font-semibold text-sm">{message.sender}</span>
            <span className="text-xs ml-2 opacity-70">{formatTimestamp(message.timestamp)}</span>
          </div>
          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
        </div>
      </div>
    );
  };

  const DateLabel = ({ date }) => (
    <div className="flex items-center justify-center my-4">
      <span className="bg-gray-200 text-gray-700 text-sm font-semibold px-3 py-1 rounded-lg">{formatDate(date)}</span>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-white">
      <nav className="flex items-center px-4 py-2 bg-white border-b">
        <img
          src="https://zuscoffee.com/wp-content/uploads/2022/03/zus_logo.png"
          alt="Brand Logo"
          className="h-10 w-10"
        />
        <span className="ml-5 text-lg">
          <strong>ZUS Coffee</strong> | <small>Chatbot History</small>
        </span>
      </nav>
      <div className="flex-1 overflow-y-auto p-4 flex justify-center bg-gray-50">
        <div className="w-full lg:max-w-[50%] bg-white shadow-sm rounded-lg">
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
              {groupedMessages.map((item, index) =>
                item.type === 'date-label' ? (
                  <DateLabel key={index} date={item.date} />
                ) : (
                  <MessageBubble key={index} message={item.message} />
                )
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistoryInterface;
