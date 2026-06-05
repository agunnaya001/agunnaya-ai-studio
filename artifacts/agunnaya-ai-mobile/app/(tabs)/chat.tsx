import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useColors } from "@/hooks/useColors";
import { supabase } from "@/lib/supabase";

type Message = { id: string; role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Write an ERC-20 token contract",
  "How do I prevent reentrancy attacks?",
  "Create an NFT minting contract",
  "Explain Uniswap V3 liquidity math",
];

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const listRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const abortRef = useRef<AbortController | null>(null);
  const s = styles(colors);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const scrollToBottom = useCallback(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
  }, []);

  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    const userText = text.trim();
    if (!userText || streaming) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInput("");

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: userText };
    const assistantId = (Date.now() + 1).toString();
    const assistantMsg: Message = { id: assistantId, role: "assistant", content: "" };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setStreaming(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const domain = process.env.EXPO_PUBLIC_DOMAIN;
      const apiUrl = domain ? `https://${domain}/api/chat` : "/api/chat";

      const history = [...messages, userMsg].map(({ role, content }) => ({ role, content }));

      const abort = new AbortController();
      abortRef.current = abort;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ messages: history }),
        signal: abort.signal,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error ?? "Request failed");
      }

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: accumulated } : m))
          );
        }
      } else {
        const text = await response.text();
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: text } : m))
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: `⚠️ ${msg}` } : m
        )
      );
    } finally {
      setStreaming(false);
      abortRef.current = null;
      inputRef.current?.focus();
    }
  }, [streaming, messages]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === "user";
    return (
      <View style={[s.row, isUser ? s.rowUser : s.rowAssistant]}>
        {!isUser && (
          <View style={s.avatar}>
            <MaterialCommunityIcons name="robot-outline" size={16} color={colors.primary} />
          </View>
        )}
        <View style={[s.bubble, isUser ? s.bubbleUser : s.bubbleAssistant]}>
          {item.content === "" && !isUser ? (
            <View style={s.typingDots}>
              <ActivityIndicator size="small" color={colors.mutedForeground} />
            </View>
          ) : (
            <Text style={[s.bubbleText, isUser ? s.bubbleTextUser : s.bubbleTextAssistant]}>
              {item.content}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const isEmpty = messages.length === 0;

  return (
    <KeyboardAvoidingView style={[s.root, { backgroundColor: colors.background }]} behavior="padding">
      {isEmpty ? (
        <View style={[s.emptyState, { paddingTop: topPad + 16 }]}>
          <View style={s.emptyIcon}>
            <MaterialCommunityIcons name="robot-excited-outline" size={40} color={colors.primary} />
          </View>
          <Text style={s.emptyTitle}>AI Studio</Text>
          <Text style={s.emptySub}>Ask me anything about Web3 development, smart contracts, or blockchain.</Text>
          <View style={s.suggestions}>
            {SUGGESTIONS.map((s_) => (
              <Pressable key={s_} style={s.chip} onPress={() => sendMessage(s_)}>
                <Text style={s.chipText}>{s_}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderMessage}
          contentContainerStyle={[s.list, { paddingTop: topPad + 12, paddingBottom: 12 }]}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
        />
      )}

      <View style={[s.inputBar, { paddingBottom: botPad + 8 }]}>
        <TextInput
          ref={inputRef}
          style={s.textInput}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about smart contracts, DeFi, NFTs…"
          placeholderTextColor={colors.mutedForeground}
          multiline
          maxLength={2000}
          returnKeyType="send"
          onSubmitEditing={() => sendMessage(input)}
        />
        <Pressable
          style={[s.sendBtn, (!input.trim() || streaming) && s.sendBtnDisabled]}
          onPress={() => sendMessage(input)}
          disabled={!input.trim() || streaming}
        >
          {streaming ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Feather name="send" size={18} color="#fff" />
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    root: { flex: 1 },
    emptyState: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: 24,
    },
    emptyIcon: {
      width: 72, height: 72, borderRadius: 24,
      backgroundColor: colors.primary + "15",
      alignItems: "center", justifyContent: "center",
      marginBottom: 16,
    },
    emptyTitle: { fontSize: 24, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold", marginBottom: 8 },
    emptySub: { fontSize: 14, color: colors.mutedForeground, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20, marginBottom: 28 },
    suggestions: { width: "100%", gap: 8 },
    chip: {
      borderWidth: 1, borderColor: colors.border,
      borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10,
      backgroundColor: colors.card,
    },
    chipText: { fontSize: 13, color: colors.foreground, fontFamily: "Inter_400Regular" },
    list: { paddingHorizontal: 16, gap: 12 },
    row: { flexDirection: "row", gap: 8, maxWidth: "85%" },
    rowUser: { alignSelf: "flex-end" },
    rowAssistant: { alignSelf: "flex-start" },
    avatar: {
      width: 28, height: 28, borderRadius: 8,
      backgroundColor: colors.primary + "15",
      alignItems: "center", justifyContent: "center",
      marginTop: 4,
    },
    bubble: { borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, flexShrink: 1 },
    bubbleUser: { backgroundColor: "#2563eb", borderBottomRightRadius: 4 },
    bubbleAssistant: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: 4 },
    bubbleText: { fontSize: 14, lineHeight: 20, fontFamily: "Inter_400Regular" },
    bubbleTextUser: { color: "#ffffff" },
    bubbleTextAssistant: { color: colors.foreground },
    typingDots: { paddingVertical: 4 },
    inputBar: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 10,
      paddingHorizontal: 16,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    textInput: {
      flex: 1,
      backgroundColor: colors.card,
      borderWidth: 1, borderColor: colors.border,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 14,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      maxHeight: 120,
    },
    sendBtn: {
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: "#2563eb",
      alignItems: "center", justifyContent: "center",
    },
    sendBtnDisabled: { opacity: 0.4 },
  });
