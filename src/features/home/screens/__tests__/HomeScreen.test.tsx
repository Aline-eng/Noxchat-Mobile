import React from "react";
import { render, screen } from "@testing-library/react-native";
import { HomeScreen } from "@/features/home/screens/HomeScreen";
import { BLOGS, NOW_PLAYING } from "@/mocks/fixtures";

const navigation = { navigate: jest.fn() } as never;
const route = {} as never;

describe("HomeScreen", () => {
  it("renders the now-playing card and the blog feed", () => {
    render(<HomeScreen navigation={navigation} route={route} />);
    expect(screen.getByText(NOW_PLAYING.title)).toBeTruthy();
    expect(screen.getByText(BLOGS[0].title)).toBeTruthy();
  });
});
