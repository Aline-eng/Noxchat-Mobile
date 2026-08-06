import { useCallback, useState } from "react";
import { requestSignupOtp } from "@/features/auth/api/authApi";

interface UseSignupResult {
  isSubmitting: boolean;
  error: string | null;
  submit: (phoneNumber: string, birthDate: string) => Promise<boolean>;
}

export function useSignup(): UseSignupResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (phoneNumber: string, birthDate: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await requestSignupOtp(phoneNumber, birthDate);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { isSubmitting, error, submit };
}
