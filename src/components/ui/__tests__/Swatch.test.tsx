import React from "react";
import { render, screen } from "@testing-library/react-native";
import { Swatch } from "@/components/ui/Swatch";

// Minimal example test — every new component should ship with at least
// this much, per CLAUDE.md's testing bar.
describe("Swatch", () => {
  it("renders the label and sublabel", () => {
    render(<Swatch color="#102C26" label="Maya" sublabel="cabin weekend" />);
    expect(screen.getByText("Maya")).toBeTruthy();
    expect(screen.getByText("cabin weekend")).toBeTruthy();
  });

  it("is accessible without a sublabel", () => {
    render(<Swatch color="#A79277" label="Culture" />);
    expect(screen.getByLabelText("Culture")).toBeTruthy();
  });
});
