import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { SignupScreen } from "@/features/auth/screens/SignupScreen";

const navigation = { navigate: jest.fn() } as never;
const route = {} as never;

describe("SignupScreen", () => {
  it("navigates to VerifyOtp with the entered phone and birth date on success", async () => {
    render(<SignupScreen navigation={navigation} route={route} />);
    fireEvent.changeText(screen.getByLabelText("Phone number"), "+10000000000");
    fireEvent.changeText(screen.getByLabelText("Birth date"), "2000-01-01");
    fireEvent.press(screen.getByLabelText("Send verification code"));

    await waitFor(() =>
      expect((navigation as { navigate: jest.Mock }).navigate).toHaveBeenCalledWith("VerifyOtp", {
        phoneNumber: "+10000000000",
        mode: "signup",
        birthDate: "2000-01-01",
      }),
    );
  });

  it("shows a format error instead of submitting for a malformed birth date", async () => {
    render(<SignupScreen navigation={navigation} route={route} />);
    fireEvent.changeText(screen.getByLabelText("Phone number"), "+10000000000");
    fireEvent.changeText(screen.getByLabelText("Birth date"), "01/01/2000");
    fireEvent.press(screen.getByLabelText("Send verification code"));

    await waitFor(() => expect(screen.getByText(/YYYY-MM-DD/)).toBeTruthy());
  });
});
