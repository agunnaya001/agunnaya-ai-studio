import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Linking from "expo-linking";
import { useColors } from "@/hooks/useColors";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackScreen() {
  const colors = useColors();
  const params = useLocalSearchParams<{ code?: string; error?: string; error_description?: string }>();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      const url = await Linking.getInitialURL();
      const code = params.code ?? (url ? new URL(url).searchParams.get("code") : null);
      const error = params.error ?? (url ? new URL(url).searchParams.get("error") : null);
      const errorDescription =
        params.error_description ??
        (url ? new URL(url).searchParams.get("error_description") : null);

      if (error) {
        setErrorMsg(errorDescription ?? error);
        setStatus("error");
        return;
      }

      if (!code) {
        setErrorMsg("No confirmation code found. Try clicking the link in your email again.");
        setStatus("error");
        return;
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        setErrorMsg(exchangeError.message);
        setStatus("error");
        return;
      }

      router.replace("/(tabs)");
    }

    handleCallback();
  }, []);

  const s = styles(colors);

  if (status === "error") {
    return (
      <View style={s.container}>
        <Text style={s.errorTitle}>Confirmation failed</Text>
        <Text style={s.errorText}>{errorMsg}</Text>
        <Text style={s.link} onPress={() => router.replace("/login")}>
          Back to sign in
        </Text>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={s.loadingText}>Confirming your account…</Text>
    </View>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16, padding: 32, backgroundColor: colors.background },
    loadingText: { fontSize: 15, color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
    errorTitle: { fontSize: 22, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold" },
    errorText: { fontSize: 14, color: colors.mutedForeground, fontFamily: "Inter_400Regular", textAlign: "center" },
    link: { fontSize: 15, color: colors.primary, fontFamily: "Inter_600SemiBold" },
  });
