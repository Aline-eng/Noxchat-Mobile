import { useCallback, useState } from "react";
import { requestLoginOtp } from "@/features/auth/api/authApi";

interface UseLoginResult {
  isSubmitting: boolean;
  error: string | null;
  submit: (phoneNumber: string) => Promise<boolean>;
}

export function useLogin(): UseLoginResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (phoneNumber: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await requestLoginOtp(phoneNumber);
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
