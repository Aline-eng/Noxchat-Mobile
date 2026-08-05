import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/RootNavigator";
import { FormField } from "@/features/auth/components/FormField";
import { useVerifyOtp } from "@/features/auth/api/useVerifyOtp";
import { requestLoginOtp, requestSignupOtp } from "@/features/auth/api/authApi";
import { colors, fontFamily, fontSize, radii, spacing } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "VerifyOtp">;

export function VerifyOtpScreen({ navigation, route }: Props) {
  const { phoneNumber, mode, birthDate } = route.params;
  const [code, setCode] = useState("");
  const [resent, setResent] = useState(false);
  const { isSubmitting, error, submit } = useVerifyOtp();

  const handleVerify = async () => {
    const success = await submit({ phoneNumber, code, birthDate });
    if (success) {
      navigation.replace("Main");
    }
  };

  const handleResend = async () => {
    if (mode === "signup" && birthDate) {
      await requestSignupOtp(phoneNumber, birthDate);
    } else {
      await requestLoginOtp(phoneNumber);
    }
    setResent(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your code</Text>
      <Text style={styles.subtitle}>We sent a 6-digit code to {phoneNumber}.</Text>
      {/* Mock-only helper -- there's no real SMS/backend yet (see
          src/features/auth/api/authApi.ts), so the fixed code is surfaced
          here to make the flow testable end-to-end. */}
      <Text style={styles.mockHint}>Mock code: 123456</Text>

      <FormField
        label="Verification code"
        value={code}
        onChangeText={setCode}
        placeholder="123456"
        keyboardType="number-pad"
        maxLength={6}
        error={error}
      />

      <Pressable
        onPress={handleVerify}
        disabled={isSubmitting || code.length !== 6}
        accessibilityRole="button"
        accessibilityLabel="Verify code"
        style={[styles.submitButton, (isSubmitting || code.length !== 6) && styles.submitButtonDisabled]}
      >
        <Text style={styles.submitLabel}>{isSubmitting ? "Verifying…" : "Verify"}</Text>
      </Pressable>

      <Pressable
        onPress={handleResend}
        accessibilityRole="button"
        accessibilityLabel="Resend code"
        style={styles.footerLink}
      >
        <Text style={styles.footerText}>{resent ? "Code resent" : "Resend code"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.latte, padding: spacing.xl },
  title: { fontFamily: fontFamily.display, fontSize: fontSize.xl, color: colors.charcoal, marginBottom: spacing.xs },
  subtitle: { fontFamily: fontFamily.ui, fontSize: fontSize.base, color: colors.inkDim },
  mockHint: {
    fontFamily: fontFamily.ui,
    fontSize: fontSize.xs,
    color: colors.donkey,
    marginBottom: spacing.xxl,
    marginTop: spacing.xs,
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
