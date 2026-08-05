import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/RootNavigator";
import { FormField } from "@/features/auth/components/FormField";
import { useLogin } from "@/features/auth/api/useLogin";
import { colors, fontFamily, fontSize, radii, spacing } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const { isSubmitting, error, submit } = useLogin();

  const handleSubmit = async () => {
    const success = await submit(phoneNumber);
    if (success) {
      navigation.navigate("VerifyOtp", { phoneNumber, mode: "login" });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>We&apos;ll text you a code to log in.</Text>

      <FormField
        label="Phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="+1 555 000 0000"
        keyboardType="phone-pad"
        error={error}
      />

      <Pressable
        onPress={handleSubmit}
        disabled={isSubmitting || !phoneNumber}
        accessibilityRole="button"
        accessibilityLabel="Send verification code"
        style={[styles.submitButton, (isSubmitting || !phoneNumber) && styles.submitButtonDisabled]}
      >
        <Text style={styles.submitLabel}>{isSubmitting ? "Sending…" : "Send code"}</Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("Signup")}
        accessibilityRole="button"
        accessibilityLabel="New here? Sign up"
        style={styles.footerLink}
      >
        <Text style={styles.footerText}>New here? Sign up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.latte, padding: spacing.xl },
  title: { fontFamily: fontFamily.display, fontSize: fontSize.xl, color: colors.charcoal, marginBottom: spacing.xs },
  subtitle: {
    fontFamily: fontFamily.ui,
    fontSize: fontSize.base,
    color: colors.inkDim,
    marginBottom: spacing.xxl,
  },
  submitButton: {
    backgroundColor: colors.forest,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitLabel: { fontFamily: fontFamily.uiBold, fontSize: fontSize.md, color: colors.latte },
  footerLink: { marginTop: spacing.xl, alignItems: "center" },
  footerText: { fontFamily: fontFamily.ui, fontSize: fontSize.sm, color: colors.forest },
});
