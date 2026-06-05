import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const ACTIONS = [
  { title: "AI Studio", desc: "Generate code with AI", icon: "robot-outline", color: "#2563eb", tab: "chat" },
  { title: "New Project", desc: "Start a Web3 project", icon: "rocket-launch-outline", color: "#7c3aed", tab: null },
  { title: "API Keys", desc: "Connect AI providers", icon: "key-outline", color: "#0891b2", tab: null },
  { title: "Documentation", desc: "Learn Agunnaya AI", icon: "book-open-outline", color: "#059669", tab: null },
] as const;

const CHECKLIST = [
  { label: "Create account", done: true },
  { label: "Verify email", doneKey: "email_confirmed_at" as const },
  { label: "Set up API keys", done: false },
  { label: "Create first project", done: false },
  { label: "Generate first contract", done: false },
];

function formatPlan(user: User): string {
  return (user.user_metadata?.plan as string | undefined) ?? "Starter";
}

function accountAgeDays(user: User): number {
  const created = new Date(user.created_at);
  const now = new Date();
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
}

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const s = styles(colors);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.replace("/login"); return; }
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  const botPad = Platform.OS === "web" ? 34 + 50 : insets.bottom + 84;
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  if (loading) {
    return (
      <View style={[s.root, { alignItems: "center", justifyContent: "center", backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const emailVerified = !!user?.email_confirmed_at;
  const plan = user ? formatPlan(user) : "Starter";
  const ageDays = user ? accountAgeDays(user) : 0;

  const stats = [
    { label: "AI Credits", value: "100", sub: "of 100/month", icon: "lightning-bolt-outline" },
    { label: "Projects", value: "0", sub: "Active", icon: "folder-outline" },
    { label: "API Keys", value: "0", sub: "Connected", icon: "key-outline" },
    { label: "Plan", value: plan, sub: `${ageDays}d member`, icon: "star-outline" },
  ];

  const checklist = CHECKLIST.map((item) => ({
    ...item,
    done: "doneKey" in item
      ? (item.doneKey === "email_confirmed_at" ? emailVerified : false)
      : item.done,
  }));

  const completedCount = checklist.filter((i) => i.done).length;

  return (
    <ScrollView
      style={[s.root, { backgroundColor: colors.background }]}
      contentContainerStyle={[s.container, { paddingTop: topPad + 12, paddingBottom: botPad }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={s.header}>
        <View style={{ flex: 1 }}>
          <Text style={s.greeting}>Welcome back</Text>
          <Text style={s.email} numberOfLines={1}>{user?.email ?? "—"}</Text>
        </View>
        <View style={s.logoDot} />
      </View>

      <View style={s.statsGrid}>
        {stats.map((stat) => (
          <View key={stat.label} style={s.statCard}>
            <MaterialCommunityIcons name={stat.icon as any} size={20} color={colors.primary} />
            <Text style={s.statValue} numberOfLines={1}>{stat.value}</Text>
            <Text style={s.statLabel}>{stat.label}</Text>
            <Text style={s.statSub}>{stat.sub}</Text>
          </View>
        ))}
      </View>

      <Text style={s.sectionTitle}>Quick Actions</Text>
      <View style={s.actionsGrid}>
        {ACTIONS.map((action) => (
          <Pressable
            key={action.title}
            style={s.actionCard}
            onPress={() => action.tab ? router.push(`/(tabs)/${action.tab}`) : null}
          >
            <View style={[s.actionIcon, { backgroundColor: action.color + "18" }]}>
              <MaterialCommunityIcons name={action.icon as any} size={22} color={action.color} />
            </View>
            <Text style={s.actionTitle}>{action.title}</Text>
            <Text style={s.actionDesc}>{action.desc}</Text>
            <Feather name="arrow-right" size={14} color={colors.mutedForeground} style={{ marginTop: 8 }} />
          </Pressable>
        ))}
      </View>

      <View style={s.checklistHeader}>
        <Text style={s.sectionTitle}>Getting Started</Text>
        <Text style={s.checklistProgress}>{completedCount}/{checklist.length}</Text>
      </View>
      <View style={s.checklistCard}>
        {checklist.map((item, i) => (
          <View key={item.label} style={[s.checkItem, i < checklist.length - 1 && s.checkItemBorder]}>
            <View style={[s.checkBox, item.done && s.checkBoxDone]}>
              {item.done && <Feather name="check" size={12} color="#fff" />}
            </View>
            <Text style={[s.checkLabel, item.done && s.checkLabelDone]}>{item.label}</Text>
            {item.done && (
              <View style={s.doneBadge}>
                <Text style={s.doneBadgeText}>Done</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    root: { flex: 1 },
    container: { paddingHorizontal: 16 },
    header: {
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      marginBottom: 20,
    },
    greeting: { fontSize: 22, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold" },
    email: { fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_400Regular", maxWidth: 240 },
    logoDot: { width: 32, height: 32, borderRadius: 8, backgroundColor: "#60a5fa" },
    statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
    statCard: {
      flex: 1, minWidth: "45%",
      backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
      borderRadius: colors.radius, padding: 14, gap: 2,
    },
    statValue: { fontSize: 22, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold", marginTop: 6 },
    statLabel: { fontSize: 13, fontWeight: "500" as const, color: colors.foreground, fontFamily: "Inter_500Medium" },
    statSub: { fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
    sectionTitle: { fontSize: 16, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold", marginBottom: 12 },
    actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
    actionCard: {
      flex: 1, minWidth: "45%",
      backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
      borderRadius: colors.radius, padding: 14,
    },
    actionIcon: {
      width: 40, height: 40, borderRadius: 10,
      alignItems: "center", justifyContent: "center", marginBottom: 8,
    },
    actionTitle: { fontSize: 14, fontWeight: "600" as const, color: colors.foreground, fontFamily: "Inter_600SemiBold" },
    actionDesc: { fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 2 },
    checklistHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
    checklistProgress: { fontSize: 13, color: colors.primary, fontFamily: "Inter_600SemiBold" },
    checklistCard: {
      backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
      borderRadius: colors.radius, overflow: "hidden",
    },
    checkItem: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
    checkItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
    checkBox: {
      width: 20, height: 20, borderRadius: 5,
      borderWidth: 2, borderColor: colors.border,
      alignItems: "center", justifyContent: "center", flexShrink: 0,
    },
    checkBoxDone: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
    checkLabel: { fontSize: 14, color: colors.foreground, fontFamily: "Inter_400Regular", flex: 1 },
    checkLabelDone: { color: colors.mutedForeground, textDecorationLine: "line-through" },
    doneBadge: {
      backgroundColor: "#22c55e15", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2,
    },
    doneBadgeText: { fontSize: 11, color: "#22c55e", fontFamily: "Inter_600SemiBold" },
  });
