"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type FileUIPart } from "ai";
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
import { Loader } from "@/components/ai-elements/loader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Recycle,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  X,
  Trash2,
} from "lucide-react";
import { useState, useRef, Suspense } from "react";
import { DisposalRecommendation } from "@/lib/schemas/recommendations";

// Helper to parse disposal recommendation from AI response
function parseDisposalRecommendation(text: string): DisposalRecommendation | null {
  try {
    // Try to find JSON in code blocks first
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    let parsed: Record<string, unknown> | null = null;
    
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[1]);
    } else {
      // Try to find raw JSON
      const jsonStart = text.indexOf("{");
      if (jsonStart >= 0) {
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

    if (parsed && parsed.item) {
      return parsed as DisposalRecommendation;
    }
  } catch {
    // Not valid JSON
  }
  return null;
}

// Helper to strip JSON from text for display
function stripJsonFromText(text: string): string {
  let cleaned = text.replace(/```(?:json)?\s*\{[\s\S]*?\}\s*```/g, '').trim();
  const jsonStart = cleaned.indexOf("{");
  if (jsonStart >= 0) {
    let braceCount = 0;
    let jsonEnd = jsonStart;
    for (let i = jsonStart; i < cleaned.length; i++) {
      if (cleaned[i] === "{") braceCount++;
      if (cleaned[i] === "}") braceCount--;
      if (braceCount === 0) {
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

function ChatPageContent() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const transport = new DefaultChatTransport({ api: "/api/ai" });
  const { messages, sendMessage, status, error } = useChat({ transport });

  const isLoading = status === "streaming" || status === "submitted";

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFiles(event.target.files);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFiles(event.target.files);
    }
  };

  const handleSubmit = () => {
    if ((input.trim() || files) && !isLoading) {
      sendMessage({
        text: input || "What is this item and how should I dispose of it in Kenya?",
        files: files,
      });
      setInput("");
      setFiles(undefined);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (cameraInputRef.current) {
        cameraInputRef.current.value = "";
      }
    }
  };

  const removeFile = (index: number) => {
    if (!files) return;
    const dt = new DataTransfer();
    Array.from(files).forEach((file, i) => {
      if (i !== index) dt.items.add(file);
    });
    setFiles(dt.files.length > 0 ? dt.files : undefined);
    if (fileInputRef.current) {
      fileInputRef.current.files = dt.files;
    }
  };

  // Get the last disposal recommendation
  const lastRecommendation = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message.role === "assistant") {
        const textContent = message.parts
          .filter((part) => part.type === "text")
          .map((part) => (part as { text: string }).text)
          .join("");
        const parsed = parseDisposalRecommendation(textContent);
        if (parsed) return parsed;
      }
    }
    return null;
  })();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">
            EcoScan Disposal Assistant
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Take a photo or upload an image of any item to get personalized disposal recommendations for Kenya
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Section */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg h-[700px] flex flex-col overflow-hidden">
              <CardHeader className="flex-shrink-0">
                <CardTitle>Upload or Capture Image</CardTitle>
                <CardDescription>
                  Show us what you need to dispose of
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                <Conversation className="flex-1">
                  <ConversationContent className="gap-6 px-6">
                    {messages.length === 0 ? (
                      <ConversationEmptyState
                        icon={<Sparkles className="w-12 h-12" />}
                        title="Ready to scan your item?"
                        description="Take a photo or upload an image to get disposal recommendations"
                      >
                        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={() => cameraInputRef.current?.click()}
                            className="gap-2"
                          >
                            <Camera className="w-5 h-5" />
                            Take Photo
                          </Button>
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={() => fileInputRef.current?.click()}
                            className="gap-2"
                          >
                            <Upload className="w-5 h-5" />
                            Upload Image
                          </Button>
                        </div>
                        <input
                          ref={cameraInputRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleCameraCapture}
                          className="hidden"
                        />
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </ConversationEmptyState>
                    ) : (
                      messages.map((message) => {
                        const textContent = message.parts
                          .filter((part) => part.type === "text")
                          .map((part) => (part as { text: string }).text)
                          .join("");

                        // Render user messages with images
                        if (message.role === "user") {
                          const imageParts = message.parts.filter(
                            (part): part is FileUIPart => part.type === "file" && part.mediaType?.startsWith("image/") === true
                          );
                          return (
                            <Message from={message.role} key={message.id}>
                              <MessageContent>
                                {imageParts.length > 0 && (
                                  <div className="mb-2 space-y-2">
                                    {imageParts.map((part, idx) => (
                                      part.url ? (
                                        <div key={idx} className="relative rounded-lg overflow-hidden border border-border">
                                          <img
                                            src={part.url}
                                            alt={`Uploaded image ${idx + 1}`}
                                            className="w-full max-w-md h-auto"
                                          />
                                        </div>
                                      ) : null
                                    ))}
                                  </div>
                                )}
                                {textContent && (
                                  <MessageResponse>{textContent}</MessageResponse>
                                )}
                              </MessageContent>
                            </Message>
                          );
                        }

                        // Render assistant messages
                        if (message.role === "assistant") {
                          const parsed = parseDisposalRecommendation(textContent);
                          
                          if (parsed) {
                            // Render structured disposal recommendation
                            return (
                              <Message from={message.role} key={message.id}>
                                <MessageContent>
                                  <div className="space-y-4">
                                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                                      <div className="flex items-start gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                          <Recycle className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                          <h3 className="font-semibold text-lg mb-1">{parsed.item}</h3>
                                          <div className="flex flex-wrap gap-2 mb-2">
                                            <Badge variant="secondary">{parsed.category}</Badge>
                                            <Badge variant={parsed.recycling_available ? "default" : "outline"}>
                                              {parsed.disposal_method}
                                            </Badge>
                                            {parsed.recycling_available && (
                                              <Badge className="bg-green-500">
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                Recyclable
                                              </Badge>
                                            )}
                                          </div>
                                          <p className="text-sm text-muted-foreground">
                                            <strong>Material:</strong> {parsed.material}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Disposal Steps */}
                                      <div className="mt-4 space-y-2">
                                        <h4 className="font-medium text-sm flex items-center gap-2">
                                          <Trash2 className="w-4 h-4" />
                                          Disposal Steps:
                                        </h4>
                                        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-6">
                                          {parsed.disposal_steps.map((step, idx) => (
                                            <li key={idx}>{step}</li>
                                          ))}
                                        </ol>
                                      </div>

                                      {/* Hazards */}
                                      {parsed.hazards && parsed.hazards.length > 0 && (
                                        <div className="mt-4 bg-destructive/5 rounded-lg p-3 border border-destructive/10">
                                          <div className="flex items-center gap-2 mb-2">
                                            <AlertTriangle className="w-4 h-4 text-destructive" />
                                            <h4 className="font-medium text-sm text-destructive">Safety Hazards:</h4>
                                          </div>
                                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-6">
                                            {parsed.hazards.map((hazard, idx) => (
                                              <li key={idx}>{hazard}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {/* Local Notes */}
                                      {parsed.local_notes && (
                                        <div className="mt-4 bg-muted/50 rounded-lg p-3">
                                          <div className="flex items-center gap-2 mb-2">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            <h4 className="font-medium text-sm">Kenya-Specific Information:</h4>
                                          </div>
                                          <p className="text-sm text-muted-foreground">{parsed.local_notes}</p>
                                        </div>
                                      )}

                                      {/* Location Info */}
                                      {parsed.location_info && (
                                        <div className="mt-3 text-sm text-muted-foreground">
                                          <strong>Disposal Locations:</strong> {parsed.location_info}
                                        </div>
                                      )}

                                      {/* Environmental Impact */}
                                      {parsed.environmental_impact && (
                                        <div className="mt-3 text-sm text-muted-foreground italic">
                                          {parsed.environmental_impact}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </MessageContent>
                              </Message>
                            );
                          }

                          // Default text rendering
                          const displayText = stripJsonFromText(textContent);
                          if (!displayText.trim()) return null;

                          return (
                            <Message from={message.role} key={message.id}>
                              <MessageContent>
                                <MessageResponse>{displayText}</MessageResponse>
                              </MessageContent>
                            </Message>
                          );
                        }

                        return null;
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

                {/* Input Area */}
                <div className="p-4 border-t border-border flex-shrink-0 space-y-3">
                  {/* Selected Files Preview */}
                  {files && files.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {Array.from(files).map((file, idx) => (
                        <div key={idx} className="relative group">
                          <div className="w-20 h-20 rounded-lg overflow-hidden border border-border bg-muted">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            onClick={() => removeFile(idx)}
                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* File Input Buttons */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => cameraInputRef.current?.click()}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      Camera
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </Button>
                  </div>

                  {/* Hidden File Inputs */}
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleCameraCapture}
                    className="hidden"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {/* Text Input */}
                  <PromptInput onSubmit={handleSubmit} className="relative">
                    <PromptInputTextarea
                      value={input}
                      placeholder="Add a note (optional)..."
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
                      disabled={!input.trim() && !files}
                      className="absolute bottom-2 right-2"
                    />
                  </PromptInput>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Last Recommendation Summary */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Disposal Guide
            </h2>

            {!lastRecommendation && !isLoading && (
              <Card className="border-0 shadow-lg">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <ImageIcon className="w-10 h-10 mx-auto mb-3 text-primary/30" />
                  <p>No analysis yet.</p>
                  <p className="text-sm mt-2">
                    Upload or capture an image to get started!
                  </p>
                </CardContent>
              </Card>
            )}

            {isLoading && !lastRecommendation && (
              <Card className="border-0 shadow-lg">
                <CardContent className="py-12 text-center">
                  <Loader />
                  <p className="text-sm text-muted-foreground mt-4">
                    Analyzing your item...
                  </p>
                </CardContent>
              </Card>
            )}

            {lastRecommendation && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">{lastRecommendation.item}</CardTitle>
                  <CardDescription>{lastRecommendation.material}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{lastRecommendation.category}</Badge>
                    <Badge variant={lastRecommendation.recycling_available ? "default" : "outline"}>
                      {lastRecommendation.disposal_method}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-2">
                    <div>
                      <strong className="text-foreground">Quick Steps:</strong>
                      <ol className="list-decimal list-inside mt-1 text-muted-foreground space-y-1">
                        {lastRecommendation.disposal_steps.slice(0, 3).map((step, idx) => (
                          <li key={idx} className="text-xs">{step}</li>
                        ))}
                      </ol>
                    </div>
                    {lastRecommendation.local_notes && (
                      <div className="pt-2 border-t border-border">
                        <strong className="text-foreground">Kenya Info:</strong>
                        <p className="text-xs text-muted-foreground mt-1">{lastRecommendation.local_notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatPageLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatPageLoading />}>
      <ChatPageContent />
    </Suspense>
  );
}
