import React from "react";
import { render, screen } from "@testing-library/react-native";
import { VibesScreen } from "@/features/vibes/screens/VibesScreen";
import { STATUS_AUTHORS } from "@/mocks/fixtures";

const navigation = { navigate: jest.fn() } as never;
const route = {} as never;

describe("VibesScreen", () => {
  it("renders the stories row and the swatch-card grid", () => {
    render(<VibesScreen navigation={navigation} route={route} />);
    expect(screen.getAllByText(STATUS_AUTHORS[0].displayName).length).toBeGreaterThan(0);
  });
});
