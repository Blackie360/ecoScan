"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RecommendationResponse } from "@/lib/schemas/recommendations";
import {
  Send,
  Loader2,
  MapPin,
  Clock,
  TrendingUp,
  Cloud,
  Car,
  Backpack,
  Shield,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";

export default function ChatPage() {
  // Create transport with useMemo to avoid recreating on each render
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai",
      }),
    []
  );

  const { messages, sendMessage, status, error } = useChat({
    transport,
  });

  const [input, setInput] = useState("");
  const [recommendations, setRecommendations] =
    useState<RecommendationResponse | null>(null);

  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", { input, isLoading, sendMessage: typeof sendMessage });
    if (input.trim() && !isLoading) {
      console.log("Calling sendMessage with:", { text: input });
      sendMessage({ text: input });
      setInput("");
    } else {
      console.log("Form submission blocked:", { inputTrimmed: input.trim(), isLoading });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Parse structured JSON from AI responses
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage &&
      lastMessage.role === "assistant" &&
      lastMessage.parts
    ) {
      try {
        // Extract text from message parts
        const textParts = lastMessage.parts
          .filter((part) => part.type === "text")
          .map((part) => (part as { text: string }).text)
          .join("");
        
        const content = textParts.trim();
        
        if (!content) {
          setRecommendations(null);
          return;
        }
        
        // Handle different JSON formats
        let jsonContent = content;
        
        // Check if content is wrapped in markdown code blocks
        const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        if (jsonMatch) {
          jsonContent = jsonMatch[1];
        }
        
        // Check if content is JSON
        if (jsonContent.startsWith("{") || jsonContent.startsWith("[")) {
          const parsed = JSON.parse(jsonContent);
          if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
            setRecommendations(parsed);
          }
        }
      } catch (e) {
        // Not JSON or invalid JSON, ignore
        // Reset recommendations if parsing fails
        if (messages.length > 0 && !isLoading) {
          setRecommendations(null);
        }
      }
    } else if (messages.length === 0) {
      setRecommendations(null);
    }
  }, [messages, isLoading]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
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
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Chat with EcoScan AI</CardTitle>
                <CardDescription>
                  Ask for recommendations based on your preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Messages */}
                <div className="space-y-4 min-h-[400px] max-h-[600px] overflow-y-auto">
                  {messages.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="mb-2">Start a conversation to get started!</p>
                      <p className="text-sm">
                        Try: "I'm feeling stressed and have 2 hours free in
                        Nairobi today"
                      </p>
                    </div>
                  )}

                  {messages.map((message) => {
                    // Extract text from message parts
                    const textParts = message.parts
                      .filter((part) => part.type === "text")
                      .map((part) => (part as { text: string }).text)
                      .join("");
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">
                            {textParts}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">
                          Thinking...
                        </span>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-destructive/10 text-destructive rounded-lg px-4 py-2 text-sm">
                      Error: {error.message}
                    </div>
                  )}
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Tell us about your preferences..."
                    className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading} size="default">
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations Sidebar */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Recommendations
            </h2>

            {!recommendations && !isLoading && (
              <Card className="border-0 shadow-lg">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <p>No recommendations yet.</p>
                  <p className="text-sm mt-2">
                    Start chatting to get personalized suggestions!
                  </p>
                </CardContent>
              </Card>
            )}

            {isLoading && (
              <Card className="border-0 shadow-lg">
                <CardContent className="py-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Finding perfect spots for you...
                  </p>
                </CardContent>
              </Card>
            )}

            {recommendations?.recommendations.map((rec, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{rec.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {rec.distance}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{rec.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Why */}
                  <div>
                    <p className="text-sm text-foreground">{rec.why}</p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{rec.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      <span>{rec.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{rec.best_time}</span>
                    </div>
                  </div>

                  {/* Weather */}
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
                      <p className="text-xs text-muted-foreground mt-2">
                        {rec.weather.advice}
                      </p>
                    </div>
                  </div>

                  {/* Transport */}
                  {rec.transport.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Car className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Transport</span>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {rec.transport.map((t, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* What to Carry */}
                  {rec.what_to_carry.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Backpack className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">What to Carry</span>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {rec.what_to_carry.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Safety Notes */}
                  {rec.safety_notes.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Safety Notes</span>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {rec.safety_notes.map((note, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-destructive">•</span>
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

