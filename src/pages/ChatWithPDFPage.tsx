
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, Send, Download, Search, Save, FileText, Bot, User } from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  pdfQuote?: {
    text: string;
    page: number;
  };
}

const ChatWithPDFPage: React.FC = () => {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10); // Mock data
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedText, setSelectedText] = useState('');
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      toast.success(language === 'en' ? 'PDF uploaded successfully' : 'فایل PDF با موفقیت آپلود شد');
    } else {
      toast.error(language === 'en' ? 'Please select a valid PDF file' : 'لطفا فایل PDF معتبر انتخاب کنید');
    }
  };
  
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      pdfQuote: selectedText ? { text: selectedText, page: currentPage } : undefined
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setSelectedText('');
    
    // Mock AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: language === 'en' 
          ? 'I understand your question about the PDF. Based on the content, here\'s my analysis...'
          : 'سوال شما در مورد PDF را متوجه شدم. بر اساس محتوا، تحلیل من این است...',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };
  
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <CardContent>
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">
              {language === 'en' ? 'Sign In Required' : 'ورود الزامی است'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'en' 
                ? 'Please sign in to access the Chat with PDF feature' 
                : 'لطفا برای دسترسی به قابلیت چت با PDF وارد شوید'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FileText className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-semibold">
              {pdfFile ? pdfFile.name : (language === 'en' ? 'Chat with PDF' : 'چت با PDF')}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => document.getElementById('pdf-upload')?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Upload PDF' : 'آپلود PDF'}
            </Button>
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
            {pdfFile && (
              <>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Download' : 'دانلود'}
                </Button>
                <Button variant="outline" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Save Chat' : 'ذخیره چت'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {!pdfFile ? (
        /* Upload State */
        <div className="flex-1 flex items-center justify-center">
          <Card className="p-12 text-center max-w-md">
            <CardContent>
              <div className="w-24 h-24 mx-auto mb-6 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                {language === 'en' ? 'Upload a PDF to get started' : 'برای شروع یک فایل PDF آپلود کنید'}
              </h2>
              <p className="text-muted-foreground mb-4">
                {language === 'en' 
                  ? 'Chat with your research papers, extract insights, and get instant answers'
                  : 'با مقالات تحقیقاتی خود چت کنید، بینش‌ها را استخراج کنید و پاسخ‌های فوری دریافت کنید'}
              </p>
              <Button onClick={() => document.getElementById('pdf-upload')?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Choose PDF File' : 'انتخاب فایل PDF'}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Main Chat Interface */
        <div className="flex-1 flex">
          {/* PDF Viewer Panel */}
          <div className="w-3/5 border-r bg-muted/20">
            <div className="p-4 border-b bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder={language === 'en' ? 'Search in PDF...' : 'جستجو در PDF...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {language === 'en' ? `Page ${currentPage} of ${totalPages}` : `صفحه ${currentPage} از ${totalPages}`}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  >
                    {language === 'en' ? 'Previous' : 'قبلی'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  >
                    {language === 'en' ? 'Next' : 'بعدی'}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* PDF Viewer Area */}
            <div className="p-4 h-full">
              <Card className="h-full">
                <CardContent className="p-8 h-full flex items-center justify-center">
                  <div 
                    className="text-center select-text cursor-text"
                    onMouseUp={handleTextSelection}
                  >
                    <div className="space-y-4 text-left max-w-2xl">
                      <h3 className="text-lg font-semibold">Sample PDF Content</h3>
                      <p className="text-sm leading-relaxed">
                        This is a mock PDF viewer. In a real implementation, you would integrate 
                        with a PDF.js viewer or similar library to display the actual PDF content. 
                        Users can select text here to quote in their chat messages.
                      </p>
                      <p className="text-sm leading-relaxed">
                        The selected text would be highlighted and automatically added to the chat 
                        input for referencing specific parts of the document during the conversation.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Chat Panel */}
          <div className="w-2/5 flex flex-col bg-background">
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium mb-2">
                      {language === 'en' ? 'Start a conversation' : 'مکالمه را شروع کنید'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' 
                        ? 'Ask questions about your PDF and get instant answers'
                        : 'در مورد PDF خود سوال بپرسید و پاسخ‌های فوری دریافت کنید'}
                    </p>
                  </div>
                ) : (
                  chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === 'ai' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === 'ai' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          {message.type === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>
                        <div className={`rounded-lg p-3 ${
                          message.type === 'ai' 
                            ? 'bg-muted text-foreground' 
                            : 'bg-primary text-primary-foreground'
                        }`}>
                          {message.pdfQuote && (
                            <div className="mb-2 p-2 bg-background/10 rounded text-xs">
                              <div className="font-medium mb-1">
                                {language === 'en' ? `Quote from page ${message.pdfQuote.page}:` : `نقل از صفحه ${message.pdfQuote.page}:`}
                              </div>
                              <div className="italic">"{message.pdfQuote.text}"</div>
                            </div>
                          )}
                          <div className="text-sm">{message.content}</div>
                          <div className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
            
            {/* Chat Input */}
            <div className="p-4 border-t bg-card">
              {selectedText && (
                <div className="mb-3 p-2 bg-muted rounded-md text-sm">
                  <div className="font-medium text-xs mb-1">
                    {language === 'en' ? 'Selected text:' : 'متن انتخاب شده:'}
                  </div>
                  <div className="italic">"{selectedText}"</div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedText('')}
                    className="mt-1 h-6 px-2 text-xs"
                  >
                    {language === 'en' ? 'Remove' : 'حذف'}
                  </Button>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder={language === 'en' ? 'Ask a question about the PDF...' : 'سوالی در مورد PDF بپرسید...'}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWithPDFPage;
