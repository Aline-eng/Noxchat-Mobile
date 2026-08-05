import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { VerifyOtpScreen } from "@/features/auth/screens/VerifyOtpScreen";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

afterEach(() => {
  useAuthStore.getState().clearSession();
  jest.clearAllMocks();
});

describe("VerifyOtpScreen", () => {
  it("replaces with Main and sets the session on the correct code", async () => {
    const navigation = { replace: jest.fn() } as never;
    const route = { params: { phoneNumber: "+10000000000", mode: "signup" as const, birthDate: "2000-01-01" } };
    render(<VerifyOtpScreen navigation={navigation} route={route as never} />);

    fireEvent.changeText(screen.getByLabelText("Verification code"), "123456");
    fireEvent.press(screen.getByLabelText("Verify code"));

    await waitFor(() => expect((navigation as { replace: jest.Mock }).replace).toHaveBeenCalledWith("Main"));
    expect(useAuthStore.getState().user?.phoneNumber).toBe("+10000000000");
  });

  it("shows an error and does not navigate on an incorrect code", async () => {
    const navigation = { replace: jest.fn() } as never;
    const route = { params: { phoneNumber: "+10000000000", mode: "login" as const } };
    render(<VerifyOtpScreen navigation={navigation} route={route as never} />);

    fireEvent.changeText(screen.getByLabelText("Verification code"), "000000");
    fireEvent.press(screen.getByLabelText("Verify code"));

    await waitFor(() => expect(screen.getByText(/incorrect/i)).toBeTruthy());
    expect((navigation as { replace: jest.Mock }).replace).not.toHaveBeenCalled();
  });
});
