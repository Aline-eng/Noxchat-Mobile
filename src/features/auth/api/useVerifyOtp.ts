import { useCallback, useState } from "react";
import { verifyOtp } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

interface VerifyOtpParams {
  phoneNumber: string;
  code: string;
  birthDate?: string;
}

interface UseVerifyOtpResult {
  isSubmitting: boolean;
  error: string | null;
  submit: (params: VerifyOtpParams) => Promise<boolean>;
}

export function useVerifyOtp(): UseVerifyOtpResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setSession = useAuthStore((state) => state.setSession);

  const submit = useCallback(
    async (params: VerifyOtpParams) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const { user, tokens } = await verifyOtp(params);
        setSession(user, tokens);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [setSession],
  );

  return { isSubmitting, error, submit };
}
