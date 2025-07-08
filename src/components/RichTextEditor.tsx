import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import {
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Wand2,
  Quote as CitationIcon,
  Expand,
  Shrink,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, className }) => {
  const { language } = useLanguage();
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [aiTask, setAiTask] = useState<'paraphrase' | 'cite' | 'expand' | 'shorten' | ''>('');
  const [selectedText, setSelectedText] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline hover:text-primary/80',
        },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: 'bg-yellow-200 dark:bg-yellow-800',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  const addLink = () => {
    if (linkUrl && editor) {
      if (linkText) {
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run();
      } else {
        editor.chain().focus().setLink({ href: linkUrl }).run();
      }
      setLinkUrl('');
      setLinkText('');
      setIsLinkDialogOpen(false);
    }
  };

  const handleAiTask = async (task: 'paraphrase' | 'cite' | 'expand' | 'shorten') => {
    const selection = editor?.state.selection;
    const text = editor?.state.doc.textBetween(selection?.from || 0, selection?.to || 0);
    
    if (!text?.trim()) {
      toast.error(language === 'en' ? 'Please select some text first' : 'لطفا ابتدا متنی را انتخاب کنید');
      return;
    }

    setSelectedText(text);
    setAiTask(task);
    setIsAiDialogOpen(true);
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      let result = '';
      switch (task) {
        case 'paraphrase':
          result = `Paraphrased: ${text} (This is a simulated paraphrasing result)`;
          break;
        case 'cite':
          result = `${text} (Author, Year)`;
          break;
        case 'expand':
          result = `${text} This expanded version provides additional context and explanation to make the point more comprehensive and detailed.`;
          break;
        case 'shorten':
          result = text.length > 20 ? text.substring(0, text.length / 2) + '...' : text;
          break;
      }
      setAiResult(result);
      setIsLoading(false);
    }, 2000);
  };

  const applyAiResult = () => {
    if (editor && aiResult) {
      const selection = editor.state.selection;
      editor.chain().focus().deleteRange({ from: selection.from, to: selection.to }).insertContent(aiResult).run();
      setIsAiDialogOpen(false);
      setAiResult('');
      setSelectedText('');
      setAiTask('');
    }
  };

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ onClick, isActive, children, title }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      title={title}
      className="h-8 w-8 p-0"
    >
      {children}
    </Button>
  );

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1">
        <div className="flex gap-1 items-center">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title={language === 'en' ? 'Bold' : 'پررنگ'}
          >
            <Bold size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title={language === 'en' ? 'Italic' : 'کج'}
          >
            <Italic size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive('highlight')}
            title={language === 'en' ? 'Highlight' : 'برجسته'}
          >
            <Highlighter size={14} />
          </ToolbarButton>
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        <div className="flex gap-1 items-center">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title={language === 'en' ? 'Align Left' : 'چپ‌چین'}
          >
            <AlignLeft size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title={language === 'en' ? 'Align Center' : 'وسط‌چین'}
          >
            <AlignCenter size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title={language === 'en' ? 'Align Right' : 'راست‌چین'}
          >
            <AlignRight size={14} />
          </ToolbarButton>
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        <div className="flex gap-1 items-center">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title={language === 'en' ? 'Bullet List' : 'فهرست نقطه‌ای'}
          >
            <List size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title={language === 'en' ? 'Numbered List' : 'فهرست شماره‌ای'}
          >
            <ListOrdered size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title={language === 'en' ? 'Quote' : 'نقل قول'}
          >
            <Quote size={14} />
          </ToolbarButton>
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        <div className="flex gap-1 items-center">
          <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title={language === 'en' ? 'Add Link' : 'افزودن پیوند'}>
                <LinkIcon size={14} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{language === 'en' ? 'Add Link' : 'افزودن پیوند'}</DialogTitle>
                <DialogDescription>
                  {language === 'en' ? 'Enter the URL and optional text for the link' : 'آدرس و متن اختیاری پیوند را وارد کنید'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="url">{language === 'en' ? 'URL' : 'آدرس'}</Label>
                  <Input
                    id="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="text">{language === 'en' ? 'Link Text (optional)' : 'متن پیوند (اختیاری)'}</Label>
                  <Input
                    id="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder={language === 'en' ? 'Link text' : 'متن پیوند'}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addLink}>{language === 'en' ? 'Add' : 'افزودن'}</Button>
                  <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
                    {language === 'en' ? 'Cancel' : 'لغو'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            title={language === 'en' ? 'Undo' : 'بازگردانی'}
          >
            <Undo size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            title={language === 'en' ? 'Redo' : 'انجام مجدد'}
          >
            <Redo size={14} />
          </ToolbarButton>
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        {/* AI Tools */}
        <div className="flex gap-1 items-center">
          <ToolbarButton
            onClick={() => handleAiTask('paraphrase')}
            title={language === 'en' ? 'AI Paraphrase' : 'بازنویسی هوشمند'}
          >
            <Wand2 size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => handleAiTask('cite')}
            title={language === 'en' ? 'Add Citation' : 'افزودن استناد'}
          >
            <CitationIcon size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => handleAiTask('expand')}
            title={language === 'en' ? 'Expand Text' : 'گسترش متن'}
          >
            <Expand size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => handleAiTask('shorten')}
            title={language === 'en' ? 'Shorten Text' : 'خلاصه‌سازی'}
          >
            <Shrink size={14} />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor */}
      <ContextMenu>
        <ContextMenuTrigger>
          <EditorContent 
            editor={editor} 
            className={`bg-background ${language === 'fa' ? 'farsi' : ''}`}
          />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => handleAiTask('paraphrase')}>
            <Wand2 size={14} className="mr-2" />
            {language === 'en' ? 'Paraphrase with AI' : 'بازنویسی با هوش مصنوعی'}
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleAiTask('cite')}>
            <CitationIcon size={14} className="mr-2" />
            {language === 'en' ? 'Add Citation' : 'افزودن استناد'}
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleAiTask('expand')}>
            <Expand size={14} className="mr-2" />
            {language === 'en' ? 'Expand Text' : 'گسترش متن'}
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleAiTask('shorten')}>
            <Shrink size={14} className="mr-2" />
            {language === 'en' ? 'Shorten Text' : 'خلاصه‌سازی'}
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold size={14} className="mr-2" />
            {language === 'en' ? 'Bold' : 'پررنگ'}
          </ContextMenuItem>
          <ContextMenuItem onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic size={14} className="mr-2" />
            {language === 'en' ? 'Italic' : 'کج'}
          </ContextMenuItem>
          <ContextMenuItem onClick={() => editor.chain().focus().toggleHighlight().run()}>
            <Highlighter size={14} className="mr-2" />
            {language === 'en' ? 'Highlight' : 'برجسته'}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* AI Result Dialog */}
      <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {language === 'en' ? 'AI Enhancement' : 'بهبود هوشمند'}
            </DialogTitle>
            <DialogDescription>
              {language === 'en' 
                ? `${aiTask === 'paraphrase' ? 'Paraphrasing' : aiTask === 'cite' ? 'Adding citation to' : aiTask === 'expand' ? 'Expanding' : 'Shortening'} your selected text`
                : `${aiTask === 'paraphrase' ? 'بازنویسی' : aiTask === 'cite' ? 'افزودن استناد به' : aiTask === 'expand' ? 'گسترش' : 'خلاصه‌سازی'} متن انتخاب شده`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>{language === 'en' ? 'Original Text:' : 'متن اصلی:'}</Label>
              <div className="p-3 bg-muted rounded-md text-sm">
                {selectedText}
              </div>
            </div>
            
            <div>
              <Label>{language === 'en' ? 'AI Result:' : 'نتیجه هوش مصنوعی:'}</Label>
              {isLoading ? (
                <div className="p-3 bg-muted rounded-md text-sm animate-pulse">
                  {language === 'en' ? 'Processing...' : 'در حال پردازش...'}
                </div>
              ) : (
                <Textarea
                  value={aiResult}
                  onChange={(e) => setAiResult(e.target.value)}
                  className="min-h-[100px]"
                  placeholder={language === 'en' ? 'AI result will appear here...' : 'نتیجه هوش مصنوعی اینجا نمایش داده می‌شود...'}
                />
              )}
            </div>
            
            <div className="flex gap-2">
              <Button onClick={applyAiResult} disabled={isLoading || !aiResult}>
                {language === 'en' ? 'Apply Changes' : 'اعمال تغییرات'}
              </Button>
              <Button variant="outline" onClick={() => setIsAiDialogOpen(false)}>
                {language === 'en' ? 'Cancel' : 'لغو'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RichTextEditor;