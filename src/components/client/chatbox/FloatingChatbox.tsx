import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocalStorage, useToggle } from 'react-use';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { RootState } from '@/lib/client/store/store';
import { useSelector } from 'react-redux';
import { User as UserType } from '@/lib/client/types/types';
// Định nghĩa kiểu dữ liệu cho một tin nhắn

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Danh sách các câu hỏi và câu trả lời mẫu của bot
const botResponses: { [key: string]: string | (() => string) } = {
  chào: 'Chào bạn! Mình là chatbot Airbnb. Mình có thể giúp gì cho bạn?',
  'tên gì': 'Mình là một trợ lý ảo được lập trình để trả lời tự động.',
  'bạn khỏe không': () => {
    const replies = [
      'Mình khỏe, cảm ơn bạn!',
      'Mình vẫn ổn, còn bạn thì sao?',
      'Tuyệt vời! Cảm ơn đã hỏi thăm.',
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  },
  giờ: () =>
    `Bây giờ là ${new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    })}.`,
  ngày: () =>
    `Hôm nay là ${new Date().toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}.`,
  'giúp gì': 'Mình có thể trả lời một số câu hỏi cơ bản. Bạn thử hỏi xem!',
  'giới thiệu':
    'Khám phá những kỳ nghỉ độc đáo với Airbnb - đặt chỗ ở, trải nghiệm địa phương và tận hưởng không gian ấm cúng như ở nhà trên khắp thế giới tại https://www.airbnb.com.vn/!',
  'tạm biệt': 'Tạm biệt! Chúc bạn một ngày tốt lành.',
  'cảm ơn': 'Rất vui khi được giúp bạn!',
  default:
    'Xin lỗi, mình chưa hiểu câu hỏi của bạn. Bạn có thể diễn đạt rõ hơn được không?',
};

const FloatingChatbox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const [isOpen, toggleIsOpen] = useToggle(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const positions = useSelector((state: RootState) => state.position);
  const [user] = useLocalStorage<UserType | null>('user', null);

  const userAvatar = useMemo(() => {
    return user?.avatar;
  }, [user]);

  // Tin nhắn chào mừng ban đầu từ bot
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            id: crypto.randomUUID(),
            text: 'Chào bạn! Mình là Chatbot Airbnb. Bạn cần hỗ trợ gì không?',
            sender: 'bot',
            timestamp: new Date(),
          },
        ]);
      }, 500);
    }
  }, [isOpen, messages.length]);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollElement) {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [messages.length, isBotTyping]);

  // Hàm lấy câu trả lời từ bot
  const getBotResponse = (userMessageText: string): string => {
    const lowerCaseMessage = userMessageText.toLowerCase().trim();
    for (const keyword in botResponses) {
      if (keyword !== 'default' && lowerCaseMessage.includes(keyword)) {
        const response = botResponses[keyword];
        return typeof response === 'function' ? response() : response;
      }
    }
    const defaultResponse = botResponses['default'];
    return typeof defaultResponse === 'function'
      ? defaultResponse()
      : defaultResponse;
  };

  // Xử lý gửi tin nhắn
  const handleSendMessage = () => {
    const trimmedInput = inputValue.trim();
    if (trimmedInput === '') return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: trimmedInput,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsBotTyping(true);

    // Tìm vị trí phù hợp
    const matchedPosition = positions.find((position) =>
      new RegExp(`đi đến trang phòng ở ${position.tinhThanh}`, 'i').test(
        trimmedInput
      )
    );

    if (matchedPosition) {
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: crypto.randomUUID(),
            text: `Đang chuyển đến trang phòng ở ${matchedPosition.tinhThanh}...`,
            sender: 'bot',
            timestamp: new Date(),
          },
        ]);
        setIsBotTyping(false);
        router.push(`/rooms/${matchedPosition.slug}`);
      }, 1000);
      return; // Dừng hàm tại đây!
    }

    // Mô phỏng bot trả lời thông thường
    setTimeout(() => {
      const botMessageText = getBotResponse(userMessage.text);
      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: botMessageText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setIsBotTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  // Xử lý phím Enter để gửi tin nhắn
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && inputValue.trim()) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearInput = () => {
    setInputValue('');
  };

  return (
    <div className="fixed inset-0 z-100 pointer-events-none">
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-transparent pointer-events-auto z-100"
          onClick={toggleIsOpen}
        />
      )}

      {/* Nút để mở/đóng chatbox */}
      <Button
        onClick={toggleIsOpen}
        className="fixed bottom-14 sm:bottom-20 right-6 rounded-full sm:w-16 sm:h-16 w-12 h-12 shadow-lg pointer-events-auto bg-rose-600 flex items-center justify-center text-white hover:bg-rose-700 cursor-pointer hover:scale-110 transition-transform"
        size="icon"
        aria-label={isOpen ? 'Đóng chat' : 'Mở chat'}
      >
        {isOpen ? (
          <X className="!w-6 !h-6" />
        ) : (
          <MessageSquare className="!w-6 !h-6" />
        )}
      </Button>

      {/* Chatbox Container */}
      {isOpen && (
        <div
          className="fixed bottom-30 sm:bottom-40 right-6 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 pointer-events-auto flex flex-col overflow-hidden"
          style={{ zIndex: 100 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10 border-2 border-rose-500">
                <AvatarFallback className="bg-rose-100">
                  <Bot size={20} className="text-rose-600" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Chatbot Airbnb
                </h3>
                <p className="text-xs text-green-500">Đang hoạt động</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleIsOpen}
              className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={16} />
            </Button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-end space-x-2 max-w-[85%] ${
                      msg.sender === 'user'
                        ? 'ml-auto justify-end'
                        : 'mr-auto justify-start'
                    }`}
                  >
                    {msg.sender === 'bot' && (
                      <Avatar className="w-7 h-7 flex-shrink-0">
                        <AvatarFallback className="bg-rose-100">
                          <Bot size={14} className="text-rose-600" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`p-3 rounded-lg shadow-sm text-sm max-w-full break-all ${
                        msg.sender === 'user'
                          ? 'bg-rose-600 text-white rounded-br-sm'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words break-all">
                        {msg.text}
                      </p>
                      <p
                        className={`text-xs mt-1 opacity-70 ${
                          msg.sender === 'user' ? 'text-right' : 'text-left'
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {msg.sender === 'user' && (
                      <Avatar className="w-7 h-7 flex-shrink-0">
                        {userAvatar && userAvatar.length > 0 ? (
                          <AvatarImage src={userAvatar} />
                        ) : (
                          <User className="text-gray-600 dark:text-gray-400" />
                        )}
                      </Avatar>
                    )}
                  </div>
                ))}
                {isBotTyping && (
                  <div className="flex items-end space-x-2 mr-auto justify-start max-w-[85%]">
                    <Avatar className="w-7 h-7 flex-shrink-0">
                      <AvatarFallback className="bg-rose-100">
                        <Bot size={14} className="text-rose-600" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="p-3 rounded-lg shadow-sm bg-gray-100 dark:bg-gray-700 rounded-bl-sm">
                      <div className="flex space-x-1 items-center">
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-2 relative">
              <Input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 h-10 px-3 text-sm border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 pr-10"
                autoComplete="off"
                aria-label="Nhập tin nhắn"
              />
              {inputValue && (
                <Button
                  variant="ghost"
                  onClick={handleClearInput}
                  size="icon"
                  className="absolute top-1/2 right-10 -translate-y-1/2 cursor-pointer"
                >
                  <X className="text-red-500 dark:text-white dark:bg-transparent" />
                </Button>
              )}
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="h-10 w-10 flex-shrink-0 bg-rose-600 hover:bg-rose-700 text-white"
                aria-label="Gửi tin nhắn"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChatbox;
