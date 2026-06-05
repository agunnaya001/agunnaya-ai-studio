import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { supabase } from "@/lib/supabase";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Sign in failed");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  const s = styles(colors);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <KeyboardAvoidingView style={s.flex} behavior="padding">
      <ScrollView
        contentContainerStyle={[s.container, { paddingTop: topPad + 20, paddingBottom: botPad + 20 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable style={s.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>

        <View style={s.header}>
          <View style={s.logoRow}>
            <View style={s.logoDot} />
            <Text style={s.logoText}>Agunnaya AI</Text>
          </View>
          <Text style={s.title}>Welcome back</Text>
          <Text style={s.subtitle}>Sign in to your account</Text>
        </View>

        <View style={s.form}>
          <View style={s.inputGroup}>
            <Text style={s.label}>Email</Text>
            <TextInput
              style={s.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={s.inputGroup}>
            <Text style={s.label}>Password</Text>
            <View style={s.passwordRow}>
              <TextInput
                style={[s.input, s.passwordInput]}
                value={password}
                onChangeText={setPassword}
                placeholder="Your password"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <Pressable style={s.eyeBtn} onPress={() => setShowPassword((v) => !v)}>
                <Feather name={showPassword ? "eye-off" : "eye"} size={18} color={colors.mutedForeground} />
              </Pressable>
            </View>
          </View>

          {error && (
            <View style={s.errorBox}>
              <Feather name="alert-circle" size={14} color="#ef4444" />
              <Text style={s.errorText}>{error}</Text>
            </View>
          )}

          <Pressable style={[s.primaryBtn, loading && s.btnDisabled]} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={s.primaryBtnText}>Sign In</Text>
            )}
          </Pressable>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>Don&apos;t have an account? </Text>
          <Pressable onPress={() => router.push("/sign-up")}>
            <Text style={s.link}>Sign up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    container: { flexGrow: 1, paddingHorizontal: 24 },
    backButton: { marginBottom: 24 },
    header: { marginBottom: 32 },
    logoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 24 },
    logoDot: { width: 28, height: 28, borderRadius: 6, backgroundColor: "#60a5fa" },
    logoText: { fontSize: 18, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold" },
    title: { fontSize: 28, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold", marginBottom: 6 },
    subtitle: { fontSize: 15, color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
    form: { gap: 16, marginBottom: 32 },
    inputGroup: { gap: 6 },
    label: { fontSize: 14, fontWeight: "500" as const, color: colors.foreground, fontFamily: "Inter_500Medium" },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: colors.radius,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
    },
    passwordRow: { position: "relative" },
    passwordInput: { paddingRight: 44 },
    eyeBtn: { position: "absolute", right: 14, top: 0, bottom: 0, justifyContent: "center" },
    errorBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: "#ef444420",
      borderWidth: 1,
      borderColor: "#ef444440",
      borderRadius: colors.radius,
      padding: 12,
    },
    errorText: { fontSize: 13, color: "#ef4444", flex: 1, fontFamily: "Inter_400Regular" },
    primaryBtn: { backgroundColor: "#2563eb", borderRadius: colors.radius, paddingVertical: 14, alignItems: "center" },
    btnDisabled: { opacity: 0.6 },
    primaryBtnText: { color: "#ffffff", fontSize: 15, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
    footer: { flexDirection: "row", justifyContent: "center" },
    footerText: { color: colors.mutedForeground, fontSize: 14, fontFamily: "Inter_400Regular" },
    link: { color: "#60a5fa", fontSize: 14, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  });
