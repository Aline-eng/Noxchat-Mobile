import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { MusicCard } from "@/features/home/components/MusicCard";
import { NOW_PLAYING } from "@/mocks/fixtures";

describe("MusicCard", () => {
  it("renders the track title and artist", () => {
    render(<MusicCard track={NOW_PLAYING} isPlaying={true} onTogglePlay={jest.fn()} />);
    expect(screen.getByText("Sunset Blvd")).toBeTruthy();
    expect(screen.getByText("Nia James · shared by Maya")).toBeTruthy();
  });

  it("calls onTogglePlay when the play/pause button is pressed", () => {
    const onTogglePlay = jest.fn();
    render(<MusicCard track={NOW_PLAYING} isPlaying={true} onTogglePlay={onTogglePlay} />);
    fireEvent.press(screen.getByLabelText("Pause"));
    expect(onTogglePlay).toHaveBeenCalledTimes(1);
  });
});
