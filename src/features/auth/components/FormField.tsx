import React from "react";
import { StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from "react-native";
import { colors, fontFamily, fontSize, radii, spacing } from "@/theme";

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  secureTextEntry?: boolean;
  error?: string | null;
}

// Shared labeled-input row for the Signup/Login/VerifyOtp forms — phone
// number, birth date, and OTP code all need the same label + input + inline
// error treatment, so it's one component rather than repeating the layout
// per screen.
export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  maxLength,
  secureTextEntry,
  error,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.donkey}
        keyboardType={keyboardType}
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
        style={[styles.input, error ? styles.inputError : null]}
        accessibilityLabel={label}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  label: {
    fontFamily: fontFamily.uiMedium,
    fontSize: fontSize.sm,
    color: colors.inkDim,
    marginBottom: spacing.xs + 2,
  },
  input: {
    fontFamily: fontFamily.ui,
    fontSize: fontSize.md,
    color: colors.ink,
    backgroundColor: colors.ivory,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.champagne,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    fontFamily: fontFamily.ui,
    fontSize: fontSize.xs,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});
