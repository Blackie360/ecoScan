"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { Loader } from "@/components/ai-elements/loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  X,
  Sparkles,
  MapPin,
  Clock,
  TrendingUp,
  Cloud,
  Smile,
  Zap,
  Mountain,
  Heart,
} from "lucide-react";
import { useState, useMemo } from "react";

// Quick prompt suggestions
const PROMPT_SUGGESTIONS = [
  {
    icon: Smile,
    label: "Feeling stressed",
    prompt: "I'm feeling stressed and need a peaceful, quiet place to relax in Nairobi today",
  },
  {
    icon: Zap,
    label: "Quick break",
    prompt: "I have 30 minutes free and want a quick nature walk near me in Nairobi",
  },
  {
    icon: Mountain,
    label: "Adventure hike",
    prompt: "I want a challenging hiking trail for the weekend, I'm fit and have a car",
  },
  {
    icon: Heart,
    label: "Family outing",
    prompt: "Looking for a family-friendly park with easy walking trails, we have kids",
  },
];

// Recommendation type for flexible parsing
type Recommendation = {
  name: string;
  type: string;
  distance?: string;
  why?: string;
  best_time?: string;
  duration?: string;
  difficulty?: string;
  weather?: { condition: string; temperature: string; advice?: string };
  transport?: string[];
  what_to_carry?: string[];
  safety_notes?: string[];
  // Alternative fields from different AI responses
  location?: string;
  accessibility?: string;
  facilities?: string[];
  activities?: string[];
  safety?: string;
};

// Helper to parse recommendations from AI response (flexible parsing)
function parseRecommendations(text: string) {
  try {
    // Try to find JSON in code blocks first
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    let parsed: Record<string, unknown> | null = null;
    let introText = "";
    
    if (jsonMatch) {
      introText = text.substring(0, text.indexOf("```")).trim();
      parsed = JSON.parse(jsonMatch[1]);
    } else {
      // Try to find raw JSON
      const jsonStart = text.indexOf("{");
      if (jsonStart >= 0) {
        introText = text.substring(0, jsonStart).trim();
        // Find the matching closing brace
        let braceCount = 0;
        let jsonEnd = jsonStart;
        for (let i = jsonStart; i < text.length; i++) {
          if (text[i] === "{") braceCount++;
          if (text[i] === "}") braceCount--;
          if (braceCount === 0) {
            jsonEnd = i + 1;
            break;
          }
        }
        parsed = JSON.parse(text.substring(jsonStart, jsonEnd));
      }
    }

    if (parsed) {
      // Handle different JSON structures: recommendations, parks, spots, etc.
      const recommendations = (parsed.recommendations || parsed.parks || parsed.spots || parsed.places || parsed.hiking_spots) as Recommendation[] | undefined;
      
      if (recommendations && Array.isArray(recommendations) && recommendations.length > 0) {
        // Normalize the recommendations to our expected format
        const normalized = recommendations.map((rec: Recommendation) => ({
          name: rec.name,
          type: rec.type || "Outdoor Space",
          distance: rec.distance || rec.location || "",
          why: rec.why || rec.accessibility || "",
          best_time: rec.best_time || "",
          duration: rec.duration || "",
          difficulty: rec.difficulty || "Easy",
          weather: rec.weather,
          transport: rec.transport || [],
          what_to_carry: rec.what_to_carry || rec.facilities || [],
          safety_notes: rec.safety_notes || (rec.safety ? [rec.safety] : []),
        }));
        return { introText, recommendations: normalized };
      }
    }
  } catch {
    // Not valid JSON
  }
  return null;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/ai" }),
    []
  );

  const { messages, sendMessage, status } = useChat({ transport });

  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!isLoading) {
      sendMessage({ text: suggestion });
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-105"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-2 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">EcoScan AI</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Find your perfect green space
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0 h-[450px] flex flex-col">
              <Conversation className="flex-1">
                <ConversationContent className="gap-4 p-4">
                  {messages.length === 0 ? (
                    <ConversationEmptyState
                      icon={<Sparkles className="w-8 h-8" />}
                      title="Hi! I'm your outdoor guide."
                      description="Click a suggestion or type your request"
                    >
                      <Suggestions className="mt-4 flex-col gap-2">
                        {PROMPT_SUGGESTIONS.map((suggestion, index) => (
                          <Suggestion
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion.prompt)}
                            suggestion={suggestion.label}
                            className="justify-start text-left"
                          />
                        ))}
                      </Suggestions>
                    </ConversationEmptyState>
                  ) : (
                    messages.map((message) => {
                      const textContent = message.parts
                        .filter((part) => part.type === "text")
                        .map((part) => (part as { text: string }).text)
                        .join("");

                      // For assistant messages, try to parse recommendations
                      if (message.role === "assistant") {
                        const parsed = parseRecommendations(textContent);
                        
                        if (parsed && parsed.recommendations.length > 0) {
                          return (
                            <Message from={message.role} key={message.id}>
                              <MessageContent>
                                {parsed.introText && (
                                  <MessageResponse>{parsed.introText}</MessageResponse>
                                )}
                                {/* Recommendation Cards */}
                                <div className="space-y-3 mt-2">
                                  {parsed.recommendations.slice(0, 3).map((rec, index) => (
                                    <div
                                      key={index}
                                      className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-3 border border-primary/20"
                                    >
                                      <div className="flex items-start justify-between gap-2 mb-2">
                                        <h4 className="font-semibold text-sm text-foreground">
                                          {rec.name}
                                        </h4>
                                        <Badge variant="secondary" className="text-xs flex-shrink-0">
                                          {rec.type}
                                        </Badge>
                                      </div>
                                      {rec.why && (
                                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                          {rec.why}
                                        </p>
                                      )}
                                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                        {rec.distance && (
                                          <span className="flex items-center gap-1 bg-background/50 px-2 py-0.5 rounded-full">
                                            <MapPin className="w-3 h-3" />
                                            {rec.distance}
                                          </span>
                                        )}
                                        {rec.duration && (
                                          <span className="flex items-center gap-1 bg-background/50 px-2 py-0.5 rounded-full">
                                            <Clock className="w-3 h-3" />
                                            {rec.duration}
                                          </span>
                                        )}
                                        {rec.difficulty && (
                                          <span className="flex items-center gap-1 bg-background/50 px-2 py-0.5 rounded-full">
                                            <TrendingUp className="w-3 h-3" />
                                            {rec.difficulty}
                                          </span>
                                        )}
                                      </div>
                                      {rec.weather && (
                                        <div className="mt-2 pt-2 border-t border-primary/10 flex items-center gap-2 text-xs">
                                          <Cloud className="w-3 h-3 text-primary" />
                                          <span className="text-muted-foreground">
                                            {rec.weather.condition} • {rec.weather.temperature}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </MessageContent>
                            </Message>
                          );
                        }
                      }

                      // Default message rendering
                      return (
                        <Message from={message.role} key={message.id}>
                          <MessageContent>
                            <MessageResponse>{textContent}</MessageResponse>
                          </MessageContent>
                        </Message>
                      );
                    })
                  )}
                  {isLoading && <Loader />}
                </ConversationContent>
                <ConversationScrollButton />
              </Conversation>

              {/* Input */}
              <div className="p-3 border-t border-border/50">
                <PromptInput
                  onSubmit={handleSubmit}
                  className="relative"
                >
                  <PromptInputTextarea
                    value={input}
                    placeholder="Ask about outdoor spots..."
                    onChange={(e) => setInput(e.currentTarget.value)}
                    className="pr-12 min-h-[44px] max-h-[120px]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                  />
                  <PromptInputSubmit
                    status={isLoading ? "streaming" : "ready"}
                    disabled={!input.trim()}
                    className="absolute bottom-1 right-1"
                  />
                </PromptInput>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
