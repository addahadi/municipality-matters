import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormFieldWrapper from '@/components/ui/form-field';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { messageSchema } from '@/lib/validations';
import { messagesApi, usersApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Loader2, MessageSquarePlus, User, CornerDownLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  content: string;
  date: string;
  readStatus: boolean;
}

interface Conversation {
  userId: string;
  username: string;
  lastMessage: Message;
  unreadCount: number;
}

const MessagesPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [form, setForm] = useState({ receiverId: '', content: '' });
  const [draft, setDraft] = useState('');
  
  const { errors, validate, clearErrors, clearFieldError } = useFormValidation(messageSchema);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      const [mRes, uRes] = await Promise.all([messagesApi.getAll(), usersApi.getAll()]);
      setMessages(mRes.data);
      setEmployees((uRes.data || []).filter((u: any) => u.role === 'EMPLOYEE' && u.id !== user?.id));
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // Compute conversations list
  const conversationsMap = new Map<string, Conversation>();
  
  messages.forEach(m => {
    const isSentByMe = m.senderId === user?.id;
    const otherUserId = isSentByMe ? m.receiverId : m.senderId;
    const otherUserName = isSentByMe ? m.receiverName : m.senderName;
    
    if (!otherUserId) return;

    const existing = conversationsMap.get(otherUserId);
    const isUnread = !isSentByMe && !m.readStatus;

    if (!existing || new Date(m.date) > new Date(existing.lastMessage.date)) {
      conversationsMap.set(otherUserId, {
        userId: otherUserId,
        username: otherUserName || 'Unknown',
        lastMessage: m,
        unreadCount: (existing?.unreadCount || 0) + (isUnread ? 1 : 0),
      });
    } else if (isUnread) {
      existing.unreadCount += 1;
    }
  });

  const conversations = Array.from(conversationsMap.values())
    .sort((a, b) => new Date(b.lastMessage.date).getTime() - new Date(a.lastMessage.date).getTime());

  const activeMessages = messages
    .filter(m => 
      (m.senderId === user?.id && m.receiverId === activeUserId) ||
      (m.receiverId === user?.id && m.senderId === activeUserId)
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages.length, activeUserId]);

  // Mark messages as read when viewing conversation
  useEffect(() => {
    if (!activeUserId) return;
    
    const unreadMessages = activeMessages.filter(m => m.receiverId === user?.id && !m.readStatus);
    
    if (unreadMessages.length > 0) {
      Promise.all(unreadMessages.map(m => messagesApi.markAsRead(m.id)))
        .then(() => fetchData())
        .catch(() => {});
    }
  }, [activeUserId, activeMessages, user?.id]);

  const handleSendDraft = async () => {
    if (!activeUserId || !draft.trim()) return;
    setSaving(true);
    try {
      await messagesApi.send({ receiverId: activeUserId, content: draft });
      setDraft('');
      fetchData();
    } catch {
      toast({ title: t('messages.sendError'), variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const handleStartNewChat = () => {
    if (!validate({ ...form, content: 'ignore' })) return; // only validate receiverId
    setActiveUserId(form.receiverId);
    setDialogOpen(false);
    setForm({ receiverId: '', content: '' });
    clearErrors();
  };

  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : 'U';

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">{t('nav.messages')}</h1>
          <Button onClick={() => setDialogOpen(true)} className="gap-2 shadow-sm">
            <MessageSquarePlus className="h-4 w-4" /> 
            {t('messages.compose') || 'New Chat'}
          </Button>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setForm({ receiverId: '', content: '' }); clearErrors(); } }}>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('messages.compose') || 'Start a new conversation'}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <FormFieldWrapper label={t('messages.to')} error={errors.receiverId} required>
                <Select value={form.receiverId} onValueChange={v => { setForm(f => ({ ...f, receiverId: v })); clearFieldError('receiverId'); }}>
                  <SelectTrigger className={errors.receiverId ? 'border-destructive' : ''}><SelectValue placeholder="Select an employee" /></SelectTrigger>
                  <SelectContent>
                    {employees.map((e: any) => (
                      <SelectItem key={e.id} value={e.id}>{e.username}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
              <Button onClick={handleStartNewChat} className="w-full">
                {t('messages.startChatting')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-full overflow-hidden border rounded-xl bg-card shadow-sm">
          {/* Conversation List Sidebar */}
          <div className="col-span-1 border-r flex flex-col h-full overflow-hidden bg-muted/10">
            <div className="p-4 border-b bg-card">
              <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">{t('messages.conversations')}</h2>
            </div>
            <ScrollArea className="flex-1">
              {loading ? (
                <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
                  <MessageSquarePlus className="h-8 w-8 opacity-20" />
                  <p>{t('messages.noMessages')}</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {conversations.map((c) => (
                    <button
                      key={c.userId}
                      onClick={() => setActiveUserId(c.userId)}
                      className={cn(
                        "flex items-start gap-3 p-4 text-left w-full transition-colors border-b last:border-b-0",
                        activeUserId === c.userId ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/50",
                        c.unreadCount > 0 ? "bg-background" : ""
                      )}
                    >
                      <Avatar className="h-10 w-10 border shadow-sm">
                        <AvatarFallback className={activeUserId === c.userId ? "bg-primary text-primary-foreground font-medium" : "bg-muted font-medium"}>
                          {getInitials(c.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex justify-between items-baseline mb-1">
                          <span className={cn("font-medium truncate", c.unreadCount > 0 && "font-bold text-foreground")}>
                            {c.username}
                          </span>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                            {formatDistanceToNow(new Date(c.lastMessage.date), { addSuffix: true })}
                          </span>
                        </div>
                        <p className={cn("text-xs truncate", c.unreadCount > 0 ? "font-medium text-foreground" : "text-muted-foreground")}>
                          {c.lastMessage.senderId === user?.id ? `${t('messages.you')}: ` : ''}
                          {c.lastMessage.content}
                        </p>
                      </div>
                      {c.unreadCount > 0 && (
                        <div className="h-5 min-w-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                          {c.unreadCount}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Chat Window */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col h-full min-h-0 bg-background relative">
            {activeUserId ? (
              <>
                {/* Chat Header — fixed, never scrolls */}
                <div className="flex items-center gap-3 p-4 border-b bg-card z-10 shrink-0">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials(conversationsMap.get(activeUserId)?.username || employees.find(e => e.id === activeUserId)?.username || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold text-sm">
                      {conversationsMap.get(activeUserId)?.username || employees.find(e => e.id === activeUserId)?.username || 'User'}
                    </h2>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      {t('messages.active')}
                    </p>
                  </div>
                </div>

                {/* Messages Area — scrollable flex child */}
                <div className="flex-1 min-h-0 overflow-hidden">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4 flex flex-col pb-4">
                    {activeMessages.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground py-20 mt-10">
                        <div className="bg-muted p-4 rounded-full mb-4">
                          <User className="h-8 w-8 opacity-50" />
                        </div>
                        <p className="text-sm">{t('messages.startConversation')}</p>
                      </div>
                    ) : (
                      activeMessages.map((msg, index) => {
                        const isMe = msg.senderId === user?.id;
                        const showDate = index === 0 || 
                          new Date(msg.date).toDateString() !== new Date(activeMessages[index - 1].date).toDateString();
                        
                        return (
                          <div key={msg.id} className="flex flex-col w-full">
                            {showDate && (
                              <div className="flex justify-center my-4">
                                <span className="text-[10px] uppercase tracking-wider bg-muted text-muted-foreground px-2 py-1 rounded-full">
                                  {new Date(msg.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                            )}
                            <div className={cn("flex max-w-[80%] mb-1", isMe ? "self-end" : "self-start")}>
                              {!isMe && (
                                <Avatar className="h-6 w-6 mt-auto mr-2 shrink-0">
                                  <AvatarFallback className="text-[9px] bg-muted">{getInitials(msg.senderName)}</AvatarFallback>
                                </Avatar>
                              )}
                              <div className={cn(
                                "rounded-2xl px-4 py-2 shadow-sm text-sm relative group whitespace-pre-wrap break-words",
                                isMe 
                                  ? "bg-primary text-primary-foreground rounded-br-sm" 
                                  : "bg-muted text-foreground rounded-bl-sm border border-border/50"
                              )}>
                                {msg.content}
                                <span className={cn(
                                  "text-[9px] block mt-1 opacity-70",
                                  isMe ? "text-right text-primary-foreground" : "text-left text-muted-foreground"
                                )}>
                                  {new Date(msg.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={chatScrollRef} />
                  </div>
                </ScrollArea>
                </div>

                {/* Input Area */}
                {/* Input — pinned to bottom */}
                <div className="shrink-0 p-4 border-t bg-card z-10 m-2 rounded-xl shadow-sm border">
                  <div className="flex items-end gap-2 relative">
                    <Textarea 
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder={t('messages.typeMessage')}
                      className="min-h-[50px] max-h-[150px] resize-none pb-12 rounded-lg border-muted-foreground/20 focus-visible:ring-1 focus-visible:ring-primary/50"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendDraft();
                        }
                      }}
                    />
                    <div className="absolute right-3 bottom-3 flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground hidden sm:flex items-center mr-2">
                        {t('messages.pressEnter')}
                        <CornerDownLeft className="h-3 w-3 ml-1" />
                      </span>
                      <Button 
                        size="icon" 
                        className="h-8 w-8 rounded-full shadow-md transition-transform active:scale-95" 
                        onClick={handleSendDraft} 
                        disabled={saving || !draft.trim()}
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 -ml-0.5" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-muted/5">
                <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <MessageSquarePlus className="h-10 w-10 opacity-30" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{t('messages.yourMessages')}</h3>
                <p className="max-w-[250px] mb-8 text-sm">{t('messages.selectOrStart')}</p>
                <Button onClick={() => setDialogOpen(true)} variant="outline" className="gap-2 bg-background shadow-sm hover:shadow">
                  <MessageSquarePlus className="h-4 w-4" /> {t('messages.startNew')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;

