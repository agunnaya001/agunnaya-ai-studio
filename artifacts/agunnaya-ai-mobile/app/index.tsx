import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { supabase } from "@/lib/supabase";

const FEATURES = [
  { icon: "flash", label: "AI Code Generation", desc: "Generate smart contracts & code instantly" },
  { icon: "shield-key", label: "Wallet Integration", desc: "Seamless Web3 wallet authentication" },
  { icon: "cube-outline", label: "Smart Contracts", desc: "Deploy across multiple chains" },
  { icon: "chart-line", label: "Analytics", desc: "Real-time usage & performance metrics" },
];

export default function LandingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/(tabs)");
      }
    });

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const s = styles(colors);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingTop: topPad + 16, paddingBottom: botPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[s.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={s.badge}>
            <View style={s.badgeDot} />
            <Text style={s.badgeText}>AI-Native Web3 Platform</Text>
          </View>

          <Text style={s.headline}>Build Web3 Apps{"\n"}with AI</Text>
          <Text style={s.subtext}>
            Generate code, deploy smart contracts, and build AI-powered dApps in minutes.
          </Text>

          <View style={s.ctaRow}>
            <Pressable
              style={s.primaryBtn}
              onPress={() => router.push("/sign-up")}
            >
              <Text style={s.primaryBtnText}>Get Started</Text>
              <Feather name="arrow-right" size={18} color="#fff" />
            </Pressable>
            <Pressable
              style={s.outlineBtn}
              onPress={() => router.push("/login")}
            >
              <Text style={s.outlineBtnText}>Sign In</Text>
            </Pressable>
          </View>
        </Animated.View>

        <View style={s.statsRow}>
          <View style={s.stat}>
            <Text style={s.statNum}>10K+</Text>
            <Text style={s.statLabel}>Developers</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.stat}>
            <Text style={s.statNum}>$50M+</Text>
            <Text style={s.statLabel}>Contracts</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.stat}>
            <Text style={s.statNum}>99.9%</Text>
            <Text style={s.statLabel}>Uptime</Text>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Powerful Features</Text>
          <View style={s.featureGrid}>
            {FEATURES.map((f) => (
              <View key={f.label} style={s.featureCard}>
                <View style={s.featureIconWrap}>
                  <MaterialCommunityIcons name={f.icon as any} size={22} color={colors.primary} />
                </View>
                <Text style={s.featureLabel}>{f.label}</Text>
                <Text style={s.featureDesc}>{f.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.ctaSection}>
          <Text style={s.ctaTitle}>Ready to build the future?</Text>
          <Text style={s.ctaSubtext}>Join thousands of developers building Web3 apps with AI.</Text>
          <Pressable style={s.primaryBtn} onPress={() => router.push("/sign-up")}>
            <Text style={s.primaryBtnText}>Start Building Free</Text>
            <Feather name="arrow-right" size={18} color="#fff" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    root: { flex: 1 },
    scroll: { paddingHorizontal: 20 },
    hero: { marginBottom: 28 },
    badge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      alignSelf: "flex-start",
      backgroundColor: colors.primary + "18",
      borderWidth: 1,
      borderColor: colors.primary + "30",
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginBottom: 20,
    },
    badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary },
    badgeText: { fontSize: 12, color: colors.primary, fontFamily: "Inter_600SemiBold" },
    headline: {
      fontSize: 42,
      fontWeight: "700" as const,
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      lineHeight: 50,
      marginBottom: 14,
    },
    subtext: {
      fontSize: 16,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      lineHeight: 24,
      marginBottom: 28,
    },
    ctaRow: { flexDirection: "row", gap: 12, flexWrap: "wrap" },
    primaryBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: "#2563eb",
      paddingVertical: 13,
      paddingHorizontal: 20,
      borderRadius: colors.radius,
    },
    primaryBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
    outlineBtn: {
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 13,
      paddingHorizontal: 20,
      borderRadius: colors.radius,
    },
    outlineBtnText: { color: colors.foreground, fontSize: 15, fontFamily: "Inter_500Medium" },
    statsRow: {
      flexDirection: "row",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: colors.radius,
      padding: 20,
      marginBottom: 32,
    },
    stat: { flex: 1, alignItems: "center" },
    statNum: { fontSize: 22, fontWeight: "700" as const, color: colors.primary, fontFamily: "Inter_700Bold" },
    statLabel: { fontSize: 12, color: colors.mutedForeground, marginTop: 2, fontFamily: "Inter_400Regular" },
    statDivider: { width: 1, backgroundColor: colors.border, marginHorizontal: 8 },
    section: { marginBottom: 32 },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      marginBottom: 16,
    },
    featureGrid: { gap: 12 },
    featureCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: colors.radius,
      padding: 16,
    },
    featureIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
    },
    featureLabel: { fontSize: 15, fontWeight: "600" as const, color: colors.foreground, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
    featureDesc: { fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
    ctaSection: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: colors.radius,
      padding: 24,
      gap: 10,
    },
    ctaTitle: { fontSize: 22, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold" },
    ctaSubtext: { fontSize: 14, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginBottom: 8 },
  });
