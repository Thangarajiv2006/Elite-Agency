import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  X,
  Minus,
  Maximize2,
  Minimize2,
  Loader2,
  TrendingUp,
  AlertTriangle,
  Package,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  DollarSign,
  FileText,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { sendAIChatMessage, type AIChatMessage } from "@/services/ai.service";
import { formatCurrency } from "@/utils/formatCurrency";

interface FloatingAICopilotProps {
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

interface MessageItem {
  id: string;
  sender: "user" | "ai";
  text: string;
  toolsUsed?: string[];
  data?: any;
  timestamp: Date;
}

// Simple markdown formatter helper to display bold text and lists nicely
const formatMessageText = (text: string) => {
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    // Check if line is bullet list
    if (line.trim().startsWith("* ") || line.trim().startsWith("• ")) {
      const content = line.trim().substring(2);
      return (
        <li key={idx} className="ml-4 list-disc text-sm py-0.5">
          {renderBoldText(content)}
        </li>
      );
    }
    return (
      <p key={idx} className="text-sm leading-relaxed mb-1.5">
        {renderBoldText(line)}
      </p>
    );
  });
};

const renderBoldText = (text: string) => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return (
        <strong key={index} className="font-semibold text-primary">
          {part}
        </strong>
      );
    }
    return part;
  });
};

export default function FloatingAICopilot({
  dateRange,
}: FloatingAICopilotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hi! I'm your **AI Finance Controller**. I can analyze your financial reports, invoices, payment risks, top products, inventory stock, and run cash flow forecasts. Ask me anything about your business performance!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dragging states
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Suggested questions
  const SUGGESTIONS = [
    { text: "Analyze my revenue", label: "Analyze Revenue" },
    { text: "Which invoices need attention?", label: "Overdue Payments" },
    { text: "Which products are performing best?", label: "Top Products" },
    { text: "Forecast next month's cash flow", label: "Cash Flow Forecast" },
  ];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isMinimized, isOpen]);

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only grab with left click
    if (e.button !== 0) return;
    // Don't drag if clicking buttons
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("input")) return;

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      let newX = e.clientX - dragStartRef.current.x;
      let newY = e.clientY - dragStartRef.current.y;

      // Keep inside viewport boundaries
      const containerWidth = 380;
      const containerHeight = isMinimized ? 56 : 520;

      // Calculate max/min offsets.
      // The default element position is right: 24px, bottom: 85px.
      // Let's compute relative coordinates
      const maxX = 24;
      const minX = -window.innerWidth + containerWidth + 24;
      const maxY = 85;
      const minY = -window.innerHeight + containerHeight + 85;

      // Clip position
      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(minY, Math.min(maxY, newY));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: MessageItem = {
      id: Math.random().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Map message history to Gemini API payload format
      // filter out the initial welcome message to save tokens if desired, or map all
      const apiHistory: AIChatMessage[] = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.sender === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        }));

      // Format date context
      const context = {
        startDate: dateRange?.from
          ? dateRange.from.toISOString().split("T")[0]
          : undefined,
        endDate: dateRange?.to
          ? dateRange.to.toISOString().split("T")[0]
          : undefined,
      };

      const response = await sendAIChatMessage(textToSend, context, apiHistory);

      const aiMsg: MessageItem = {
        id: Math.random().toString(),
        sender: "ai",
        text: response.answer,
        toolsUsed: response.toolsUsed,
        data: response.data,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to communicate with AI.";
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "ai",
          text: `⚠️ **Error:** ${errorMsg}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  // Rendering rich cards for specific tools used
  const renderDataWidget = (msg: MessageItem) => {
    if (!msg.data) return null;

    // widget: compareRevenue / getRevenue
    if (msg.data.compareRevenue) {
      const comp = msg.data.compareRevenue;
      const isUp = comp.percentageChange >= 0;
      return (
        <Card className="my-2 border border-zinc-800 bg-zinc-900/60 p-3 rounded-lg">
          <CardContent className="p-0 flex flex-col gap-1.5">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Revenue Comparison
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-zinc-100">
                ₹{formatCurrency(comp.currentPeriod.totalRevenue)}
              </span>
              <Badge
                className={`flex items-center gap-0.5 border-0 font-medium ${
                  isUp
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-rose-500/10 text-rose-400"
                }`}
              >
                {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {isUp ? "+" : ""}
                {comp.percentageChange}%
              </Badge>
            </div>
            <div className="text-[12px] text-muted-foreground flex flex-col gap-0.5 border-t border-zinc-800/80 pt-1.5 mt-1">
              <div className="flex justify-between">
                <span>Current Period:</span>
                <span className="text-zinc-300 font-medium">
                  {comp.currentPeriod.startDate} to {comp.currentPeriod.endDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Previous Period:</span>
                <span className="text-zinc-300 font-medium">
                  {comp.previousPeriod.startDate} to{" "}
                  {comp.previousPeriod.endDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Previous Revenue:</span>
                <span className="text-zinc-300">
                  ₹{formatCurrency(comp.previousPeriod.totalRevenue)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // widget: getOutstandingPayments
    if (
      msg.data.getOutstandingPayments &&
      Array.isArray(msg.data.getOutstandingPayments)
    ) {
      const outstanding = msg.data.getOutstandingPayments.slice(0, 3); // limit to top 3 for UI sizing
      if (outstanding.length === 0) {
        return (
          <div className="my-2 border border-emerald-950 bg-emerald-950/20 text-emerald-400 p-2 text-xs rounded-md flex items-center gap-1.5">
            <CheckCircle2 size={13} />
            No outstanding payments requiring critical attention.
          </div>
        );
      }
      return (
        <div className="my-2 flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-0.5">
            Critical Outstanding Invoices (
            {msg.data.getOutstandingPayments.length})
          </span>
          {outstanding.map((item: any, idx: number) => {
            const isHigh = item.priority === "HIGH";
            const isMedium = item.priority === "MEDIUM";
            return (
              <Card
                key={idx}
                className="border border-zinc-800 bg-zinc-900/60 p-2.5 rounded-lg"
              >
                <CardContent className="p-0 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-xs text-zinc-100">
                      {item.invoiceNo}
                    </span>
                    <Badge
                      className={`text-[10px] px-1.5 py-0 border-0 ${
                        isHigh
                          ? "bg-rose-500/20 text-rose-400"
                          : isMedium
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-zinc-500/20 text-zinc-400"
                      }`}
                    >
                      {item.priority} RISK
                    </Badge>
                  </div>
                  <div className="flex justify-between items-baseline text-xs text-zinc-300">
                    <span>{item.shop.shopName}</span>
                    <span className="font-bold text-zinc-100">
                      ₹{formatCurrency(item.dueAmount)} due
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1 flex flex-col gap-0.5">
                    {item.reasons.slice(1).map((r: string, rIdx: number) => (
                      <div key={rIdx} className="flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-zinc-600" />
                        {r}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      );
    }

    // widget: getStockSummary
    if (msg.data.getStockSummary) {
      const stock = msg.data.getStockSummary;
      const lowStockList = stock.details || [];
      return (
        <Card className="my-2 border border-zinc-800 bg-zinc-900/60 p-3 rounded-lg">
          <CardContent className="p-0 flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Stock Levels Overview
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-zinc-950/40 p-1.5 rounded border border-zinc-800/50">
                <div className="text-lg font-bold text-zinc-100">
                  {stock.totalProducts}
                </div>
                <div className="text-[9px] text-muted-foreground uppercase font-medium">
                  Total Items
                </div>
              </div>
              <div className="bg-zinc-950/40 p-1.5 rounded border border-zinc-800/50">
                <div className="text-lg font-bold text-amber-400">
                  {stock.lowStock}
                </div>
                <div className="text-[9px] text-muted-foreground uppercase font-medium">
                  Low Stock
                </div>
              </div>
              <div className="bg-zinc-950/40 p-1.5 rounded border border-zinc-800/50">
                <div className="text-lg font-bold text-rose-400">
                  {stock.outOfStock}
                </div>
                <div className="text-[9px] text-muted-foreground uppercase font-medium">
                  Out of Stock
                </div>
              </div>
            </div>
            {lowStockList.length > 0 && (
              <div className="flex flex-col gap-1 border-t border-zinc-800/80 pt-2 mt-1">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground px-0.5">
                  Restock Recommendations
                </span>
                <div className="flex flex-col gap-1 max-h-[100px] overflow-y-auto pr-1">
                  {lowStockList.slice(0, 4).map((p: any, pIdx: number) => (
                    <div
                      key={pIdx}
                      className="flex justify-between items-center text-xs"
                    >
                      <span className="text-zinc-300 truncate max-w-[180px]">
                        {p.name}
                      </span>
                      <span
                        className={`font-semibold ${p.stock === 0 ? "text-rose-400" : "text-amber-400"}`}
                      >
                        {p.stock} {p.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    // widget: getForecast
    if (msg.data.getForecast) {
      const forecast = msg.data.getForecast;
      return (
        <Card className="my-2 border border-zinc-800 bg-zinc-900/60 p-3 rounded-lg">
          <CardContent className="p-0 flex flex-col gap-1.5">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Cash Flow Forecast (Estimate)
            </span>
            <div className="flex justify-between items-baseline">
              <span className="text-xl font-bold text-primary">
                ₹{formatCurrency(forecast.predictedValue)}
              </span>
              <Badge className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-[9px] uppercase">
                {forecast.confidenceOrDataQuality} CONFIDENCE
              </Badge>
            </div>
            <div className="text-[11px] text-muted-foreground flex flex-col gap-0.5 border-t border-zinc-800/80 pt-1.5 mt-1.5">
              <div className="flex justify-between">
                <span>Model Method:</span>
                <span className="text-zinc-300">{forecast.method}</span>
              </div>
              <div className="flex justify-between">
                <span>Historical Basis:</span>
                <span className="text-zinc-300">
                  {forecast.historicalPeriod}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Trend Formula:</span>
                <span className="text-zinc-300 font-mono text-[9px]">
                  {forecast.explanationData.formulaUsed}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // widget: getTopProducts
    if (msg.data.getTopProducts && Array.isArray(msg.data.getTopProducts)) {
      const topProds = msg.data.getTopProducts.slice(0, 3);
      if (topProds.length === 0) return null;
      return (
        <Card className="my-2 border border-zinc-800 bg-zinc-900/60 p-2.5 rounded-lg">
          <CardContent className="p-0 flex flex-col gap-1.5">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Top Selling Products
            </span>
            <div className="flex flex-col gap-1.5">
              {topProds.map((prod: any, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-xs border-b border-zinc-800/40 pb-1.5 last:border-0 last:pb-0"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-zinc-100">
                      {prod.productName}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {prod.totalQuantity} items sold
                    </span>
                  </div>
                  <span className="font-bold text-zinc-100">
                    ₹{formatCurrency(prod.totalRevenue)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  return (
    <div
      className="fixed z-50 transition-all duration-200"
      style={{
        bottom: "85px",
        right: "24px",
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {/* Floating Button initially */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/95 text-primary-foreground flex items-center justify-center p-0 transition-transform active:scale-95"
        >
          <MessageSquare className="h-6 w-6 animate-pulse" />
        </Button>
      )}

      {/* Modern Chat Window */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className={`w-[380px] rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl flex flex-col select-none overflow-hidden transition-all duration-150 ${
            isMinimized ? "h-[56px]" : "h-[520px]"
          }`}
        >
          {/* Header (Draggable) */}
          <div
            onMouseDown={handleMouseDown}
            className="h-14 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between cursor-grab active:cursor-grabbing text-zinc-100 select-none"
          >
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping absolute" />
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="font-semibold text-sm tracking-wide">
                Elite AI Controller
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-7 w-7 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md p-0"
              >
                {isMinimized ? <Maximize2 size={13} /> : <Minus size={13} />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(false);
                }}
                className="h-7 w-7 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-md p-0"
              >
                <X size={13} />
              </Button>
            </div>
          </div>

          {/* Chat Body (Hidden when Minimized) */}
          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 max-h-[385px]">
                {messages.map((msg) => {
                  const isUser = msg.sender === "user";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] ${isUser ? "self-end items-end" : "self-start items-start"}`}
                    >
                      <div
                        className={`rounded-2xl px-3.5 py-2.5 text-xs shadow-sm leading-relaxed ${
                          isUser
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-zinc-900 text-zinc-100 rounded-tl-none border border-zinc-800"
                        }`}
                      >
                        {formatMessageText(msg.text)}
                        {/* Render rich widgets for response tools */}
                        {renderDataWidget(msg)}
                      </div>
                      <span className="text-[9px] text-muted-foreground mt-1 px-1">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="self-start flex flex-col max-w-[85%] items-start">
                    <div className="bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                      <Loader2 className="h-4.5 w-4.5 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground font-medium">
                        AI is analyzing reports...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions Tray (Only shown when not loading) */}
              {!isLoading && (
                <div className="px-4 py-1.5 flex gap-1.5 overflow-x-auto border-t border-zinc-900 bg-zinc-950/60 no-scrollbar select-none">
                  {SUGGESTIONS.map((s, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      onClick={() => handleSendMessage(s.text)}
                      className="whitespace-nowrap py-1 px-2.5 h-7 text-[10px] font-medium border-zinc-800 text-zinc-300 hover:text-primary hover:border-primary/50 hover:bg-zinc-900 rounded-full"
                    >
                      {s.label}
                    </Button>
                  ))}
                </div>
              )}

              {/* Chat Input form */}
              <form
                onSubmit={handleFormSubmit}
                className="h-[58px] border-t border-zinc-850 px-3 bg-zinc-900/40 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about your business data..."
                  disabled={isLoading}
                  className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-full px-4 h-9 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder-zinc-500"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !inputValue.trim()}
                  className="h-9 w-9 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground p-0 flex items-center justify-center shrink-0 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
