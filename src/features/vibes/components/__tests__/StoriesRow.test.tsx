import React from "react";
import { render, screen } from "@testing-library/react-native";
import { StoriesRow } from "@/features/vibes/components/StoriesRow";
import { STATUSES } from "@/mocks/fixtures";

describe("StoriesRow", () => {
  it("renders one avatar label per item", () => {
    const items = [
      { status: STATUSES[0], authorName: "Maya", swatchColor: "#102C26" },
      { status: STATUSES[1], authorName: "Sam", swatchColor: "#C19A6B" },
    ];
    render(<StoriesRow items={items} />);
    expect(screen.getByText("Maya")).toBeTruthy();
    expect(screen.getByText("Sam")).toBeTruthy();
  });
});
