import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const MENU_ITEMS = [
  { icon: "key", label: "API Keys", desc: "Manage your API keys" },
  { icon: "folder", label: "Projects", desc: "View your projects" },
  { icon: "credit-card", label: "Billing", desc: "Manage subscription & usage" },
  { icon: "help-circle", label: "Support", desc: "Get help & documentation" },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User | null>(null);
  const s = styles(colors);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.replace("/login"); return; }
      setUser(data.user);
    });
  }, []);

  const handleSignOut = () => {
    if (Platform.OS === "web") {
      supabase.auth.signOut().then(() => router.replace("/"));
      return;
    }
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.replace("/");
        },
      },
    ]);
  };

  const initial = user?.email?.charAt(0).toUpperCase() ?? "?";
  const botPad = Platform.OS === "web" ? 34 + 50 : insets.bottom + 84;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[s.container, { paddingBottom: botPad }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={s.avatarSection}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{initial}</Text>
        </View>
        <Text style={s.email}>{user?.email ?? "—"}</Text>
        <View style={s.planBadge}>
          <MaterialCommunityIcons name="star-outline" size={12} color={colors.primary} />
          <Text style={s.planText}>Starter Plan</Text>
        </View>
      </View>

      <View style={s.statsRow}>
        <View style={s.stat}>
          <Text style={s.statNum}>100</Text>
          <Text style={s.statLabel}>AI Credits</Text>
        </View>
        <View style={s.divider} />
        <View style={s.stat}>
          <Text style={s.statNum}>0</Text>
          <Text style={s.statLabel}>Projects</Text>
        </View>
        <View style={s.divider} />
        <View style={s.stat}>
          <Text style={s.statNum}>0</Text>
          <Text style={s.statLabel}>API Keys</Text>
        </View>
      </View>

      <View style={s.menuSection}>
        {MENU_ITEMS.map((item) => (
          <Pressable key={item.label} style={s.menuItem}>
            <View style={s.menuIcon}>
              <Feather name={item.icon as any} size={18} color={colors.primary} />
            </View>
            <View style={s.menuContent}>
              <Text style={s.menuLabel}>{item.label}</Text>
              <Text style={s.menuDesc}>{item.desc}</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
          </Pressable>
        ))}
      </View>

      <Pressable style={s.signOutBtn} onPress={handleSignOut}>
        <Feather name="log-out" size={18} color="#ef4444" />
        <Text style={s.signOutText}>Sign Out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: { padding: 20 },
    avatarSection: { alignItems: "center", paddingVertical: 24, gap: 8 },
    avatar: {
      width: 72, height: 72, borderRadius: 36,
      backgroundColor: "#2563eb",
      alignItems: "center", justifyContent: "center",
      marginBottom: 4,
    },
    avatarText: { fontSize: 28, fontWeight: "700" as const, color: "#fff", fontFamily: "Inter_700Bold" },
    email: { fontSize: 16, color: colors.foreground, fontFamily: "Inter_500Medium" },
    planBadge: {
      flexDirection: "row", alignItems: "center", gap: 4,
      backgroundColor: colors.primary + "15",
      borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4,
    },
    planText: { fontSize: 12, color: colors.primary, fontFamily: "Inter_600SemiBold" },
    statsRow: {
      flexDirection: "row",
      backgroundColor: colors.card,
      borderWidth: 1, borderColor: colors.border,
      borderRadius: colors.radius,
      padding: 16, marginBottom: 20,
    },
    stat: { flex: 1, alignItems: "center" },
    statNum: { fontSize: 22, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold" },
    statLabel: { fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 2 },
    divider: { width: 1, backgroundColor: colors.border, marginHorizontal: 8 },
    menuSection: {
      backgroundColor: colors.card,
      borderWidth: 1, borderColor: colors.border,
      borderRadius: colors.radius, marginBottom: 20, overflow: "hidden",
    },
    menuItem: {
      flexDirection: "row", alignItems: "center", gap: 12,
      padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    menuIcon: {
      width: 36, height: 36, borderRadius: 8,
      backgroundColor: colors.primary + "12",
      alignItems: "center", justifyContent: "center",
    },
    menuContent: { flex: 1 },
    menuLabel: { fontSize: 15, color: colors.foreground, fontFamily: "Inter_500Medium" },
    menuDesc: { fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
    signOutBtn: {
      flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
      borderWidth: 1, borderColor: "#ef444440",
      backgroundColor: "#ef444410",
      borderRadius: colors.radius, paddingVertical: 14,
    },
    signOutText: { fontSize: 15, color: "#ef4444", fontFamily: "Inter_600SemiBold" },
  });
