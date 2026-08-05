import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/RootNavigator";
import { FormField } from "@/features/auth/components/FormField";
import { useSignup } from "@/features/auth/api/useSignup";
import { colors, fontFamily, fontSize, radii, spacing } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Signup">;

const BIRTH_DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;

export function SignupScreen({ navigation }: Props) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthDateError, setBirthDateError] = useState<string | null>(null);
  const { isSubmitting, error, submit } = useSignup();

  const handleSubmit = async () => {
    if (!BIRTH_DATE_FORMAT.test(birthDate)) {
      setBirthDateError("Enter your birth date as YYYY-MM-DD.");
      return;
    }
    setBirthDateError(null);
    const success = await submit(phoneNumber, birthDate);
    if (success) {
      navigation.navigate("VerifyOtp", { phoneNumber, mode: "signup", birthDate });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.subtitle}>We&apos;ll text you a code to verify your number.</Text>

      <FormField
        label="Phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="+1 555 000 0000"
        keyboardType="phone-pad"
      />
      <FormField
        label="Birth date"
        value={birthDate}
        onChangeText={setBirthDate}
        placeholder="YYYY-MM-DD"
        keyboardType="numeric"
        maxLength={10}
        error={birthDateError ?? error}
      />

      <Pressable
        onPress={handleSubmit}
        disabled={isSubmitting || !phoneNumber || !birthDate}
        accessibilityRole="button"
        accessibilityLabel="Send verification code"
        style={[styles.submitButton, (isSubmitting || !phoneNumber || !birthDate) && styles.submitButtonDisabled]}
      >
        <Text style={styles.submitLabel}>{isSubmitting ? "Sending…" : "Send code"}</Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("Login")}
        accessibilityRole="button"
        accessibilityLabel="Already have an account? Log in"
        style={styles.footerLink}
      >
        <Text style={styles.footerText}>Already have an account? Log in</Text>
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
