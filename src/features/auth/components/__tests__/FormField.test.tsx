import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { FormField } from "@/features/auth/components/FormField";

describe("FormField", () => {
  it("renders the label and calls onChangeText", () => {
    const onChangeText = jest.fn();
    render(<FormField label="Phone number" value="" onChangeText={onChangeText} />);
    expect(screen.getByText("Phone number")).toBeTruthy();
    fireEvent.changeText(screen.getByLabelText("Phone number"), "+10000000000");
    expect(onChangeText).toHaveBeenCalledWith("+10000000000");
  });

  it("shows the error message when provided", () => {
    render(
      <FormField label="Code" value="" onChangeText={jest.fn()} error="Incorrect code. Try again." />,
    );
    expect(screen.getByText("Incorrect code. Try again.")).toBeTruthy();
  });
});
