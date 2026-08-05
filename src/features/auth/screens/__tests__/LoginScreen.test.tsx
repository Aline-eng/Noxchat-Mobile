import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { LoginScreen } from "@/features/auth/screens/LoginScreen";

const navigation = { navigate: jest.fn() } as never;
const route = {} as never;

describe("LoginScreen", () => {
  it("navigates to VerifyOtp with the entered phone number on success", async () => {
    render(<LoginScreen navigation={navigation} route={route} />);
    fireEvent.changeText(screen.getByLabelText("Phone number"), "+10000000000");
    fireEvent.press(screen.getByLabelText("Send verification code"));

    await waitFor(() =>
      expect((navigation as { navigate: jest.Mock }).navigate).toHaveBeenCalledWith("VerifyOtp", {
        phoneNumber: "+10000000000",
        mode: "login",
      }),
    );
  });
});
