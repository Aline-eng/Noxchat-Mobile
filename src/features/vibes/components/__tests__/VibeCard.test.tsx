import React from "react";
import { render, screen } from "@testing-library/react-native";
import { VibeCard } from "@/features/vibes/components/VibeCard";
import { STATUSES } from "@/mocks/fixtures";

describe("VibeCard", () => {
  it("renders the author name and status caption", () => {
    const item = { status: STATUSES[0], authorName: "Maya", swatchColor: "#102C26" };
    render(<VibeCard item={item} />);
    expect(screen.getByLabelText(`Maya: ${STATUSES[0].content}`)).toBeTruthy();
  });
});
