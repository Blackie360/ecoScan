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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  TrendingUp,
  Cloud,
  Car,
  Backpack,
  Shield,
  Sparkles,
  Smile,
  Heart,
  Zap,
  TreePine,
  Footprints,
  Mountain,
  LucideIcon,
  ExternalLink,
  Star,
  Navigation,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { DestinationImage } from "@/components/DestinationImage";

// Quick prompt suggestions
const PROMPT_SUGGESTIONS: { icon: LucideIcon; label: string; prompt: string }[] = [
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
  {
    icon: TreePine,
    label: "Forest escape",
    prompt: "I need a forest or wooded area to escape the city, preferably within 1 hour of Nairobi",
  },
  {
    icon: Footprints,
    label: "Morning jog",
    prompt: "Best places for a morning jog surrounded by nature in Nairobi tomorrow",
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
  // Real location data from location tool
  mapsUrl?: string;
  photoUrl?: string;
  address?: string;
  rating?: number;
  // Alternative fields from different AI responses
  location?: string;
  accessibility?: string;
  facilities?: string[];
  activities?: string[];
  safety?: string;
};

// Helper to strip JSON from text (for display purposes)
function stripJsonFromText(text: string): string {
  // Remove JSON code blocks
  let cleaned = text.replace(/```(?:json)?\s*\{[\s\S]*?\}\s*```/g, '').trim();
  
  // Also try to remove raw JSON objects if present
  const jsonStart = cleaned.indexOf("{");
  if (jsonStart >= 0) {
    // Find if there's a valid JSON object and remove it
    let braceCount = 0;
    let inJson = false;
    let jsonEnd = -1;
    
    for (let i = jsonStart; i < cleaned.length; i++) {
      if (cleaned[i] === "{") {
        braceCount++;
        inJson = true;
      }
      if (cleaned[i] === "}") {
        braceCount--;
      }
      if (inJson && braceCount === 0) {
        jsonEnd = i + 1;
        break;
      }
    }
    
    if (jsonEnd > jsonStart) {
      cleaned = cleaned.substring(0, jsonStart) + cleaned.substring(jsonEnd);
    }
  }
  
  return cleaned.trim();
}

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
          // Real location data
          mapsUrl: rec.mapsUrl || "",
          photoUrl: rec.photoUrl || "",
          address: rec.address || "",
          rating: rec.rating,
        }));
        return { introText, recommendations: normalized };
      }
    }
  } catch {
    // Not valid JSON
  }
  return null;
}

export default function ChatPage() {
  const [input, setInput] = useState("");

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/ai" }),
    []
  );

  const { messages, sendMessage, status, error } = useChat({ transport });

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

  // Get the last parsed recommendations for the sidebar
  const lastRecommendations = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message.role === "assistant") {
        const textContent = message.parts
          .filter((part) => part.type === "text")
          .map((part) => (part as { text: string }).text)
          .join("");
        const parsed = parseRecommendations(textContent);
        if (parsed) return parsed.recommendations;
      }
    }
    return null;
  }, [messages]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">
            Find Your Perfect Green Space
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tell us about your mood, available time, and location. We'll
            recommend the perfect parks, trails, and nature spots for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Section */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg h-[700px] flex flex-col overflow-hidden">
              <CardHeader className="flex-shrink-0">
                <CardTitle>Chat with EcoScan AI</CardTitle>
                <CardDescription>
                  Ask for recommendations based on your preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                <Conversation className="flex-1">
                  <ConversationContent className="gap-6 px-6">
                    {messages.length === 0 ? (
                      <ConversationEmptyState
                        icon={<Sparkles className="w-12 h-12" />}
                        title="What kind of outdoor experience are you looking for?"
                        description="Click a suggestion below or type your own request"
                      >
                        <Suggestions className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {PROMPT_SUGGESTIONS.map((suggestion, index) => (
                            <Suggestion
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion.prompt)}
                              suggestion={suggestion.label}
                              className="justify-start text-left p-4"
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
                                  {/* Inline Recommendation Preview */}
                                  <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                                    <p className="text-sm text-muted-foreground mb-2">
                                      Found {parsed.recommendations.length} recommendation{parsed.recommendations.length > 1 ? 's' : ''} for you →
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {parsed.recommendations.slice(0, 3).map((rec, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-xs">
                                          {rec.name}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </MessageContent>
                              </Message>
                            );
                          }
                        }

                        // Default message rendering - strip any JSON from assistant messages
                        const displayText = message.role === "assistant" 
                          ? stripJsonFromText(textContent)
                          : textContent;
                        
                        // Don't render empty messages
                        if (!displayText.trim()) {
                          return null;
                        }
                        
                        return (
                          <Message from={message.role} key={message.id}>
                            <MessageContent>
                              <MessageResponse>{displayText}</MessageResponse>
                            </MessageContent>
                          </Message>
                        );
                      })
                    )}
                    {isLoading && <Loader />}
                    {error && (
                      <div className="bg-destructive/10 text-destructive rounded-lg px-4 py-2 text-sm">
                        Error: {error.message}
                      </div>
                    )}
                  </ConversationContent>
                  <ConversationScrollButton />
                </Conversation>

                {/* Input */}
                <div className="p-4 border-t border-border flex-shrink-0">
                  <PromptInput onSubmit={handleSubmit} className="relative">
                    <PromptInputTextarea
                      value={input}
                      placeholder="Tell us about your preferences..."
                      onChange={(e) => setInput(e.currentTarget.value)}
                      className="pr-14 min-h-[52px] max-h-[200px]"
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
                      className="absolute bottom-2 right-2"
                    />
                  </PromptInput>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations Sidebar */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Recommendations
            </h2>

            {!lastRecommendations && !isLoading && (
              <Card className="border-0 shadow-lg">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Sparkles className="w-10 h-10 mx-auto mb-3 text-primary/30" />
                  <p>No recommendations yet.</p>
                  <p className="text-sm mt-2">
                    Start chatting to get personalized suggestions!
                  </p>
                </CardContent>
              </Card>
            )}

            {isLoading && !lastRecommendations && (
              <Card className="border-0 shadow-lg">
                <CardContent className="py-12 text-center">
                  <Loader />
                  <p className="text-sm text-muted-foreground mt-4">
                    Finding perfect spots for you...
                  </p>
                </CardContent>
              </Card>
            )}

            {lastRecommendations?.map((rec, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                {/* Real Photo or AI Generated Image */}
                {rec.photoUrl ? (
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={rec.photoUrl}
                      alt={rec.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Hide broken image
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="bg-black/50 text-white border-0 text-xs">
                        <ImageIcon className="w-3 h-3 mr-1" />
                        Real Photo
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <DestinationImage
                    placeName={rec.name}
                    placeType={rec.type}
                    aspectRatio="video"
                    className="w-full"
                  />
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{rec.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {rec.address || rec.distance}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="secondary">{rec.type}</Badge>
                      {rec.rating && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span>{rec.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Google Maps Button */}
                  {rec.mapsUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <a href={rec.mapsUrl} target="_blank" rel="noopener noreferrer">
                        <Navigation className="w-4 h-4 mr-2" />
                        Open in Google Maps
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </a>
                    </Button>
                  )}

                  {/* Why */}
                  <p className="text-sm text-foreground">{rec.why}</p>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{rec.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span>{rec.difficulty}</span>
                    </div>
                  </div>

                  {/* Weather */}
                  {rec.weather && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Cloud className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Weather</span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Condition:</span>
                          <span className="font-medium">{rec.weather.condition}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Temperature:</span>
                          <span className="font-medium">{rec.weather.temperature}</span>
                        </div>
                        {rec.weather.advice && (
                          <p className="text-xs text-muted-foreground mt-2 italic">
                            {rec.weather.advice}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Transport */}
                  {rec.transport && rec.transport.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Car className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Getting There</span>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {rec.transport.map((t, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* What to Carry */}
                  {rec.what_to_carry && rec.what_to_carry.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Backpack className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">What to Bring</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {rec.what_to_carry.map((item, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Safety Notes */}
                  {rec.safety_notes && rec.safety_notes.length > 0 && (
                    <div className="bg-destructive/5 rounded-lg p-3 border border-destructive/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-destructive" />
                        <span className="text-sm font-medium text-destructive">Safety Notes</span>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {rec.safety_notes.map((note, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-destructive mt-1">!</span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
