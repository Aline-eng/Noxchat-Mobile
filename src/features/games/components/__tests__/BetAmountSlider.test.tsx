import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { BetAmountSlider } from "@/features/games/components/BetAmountSlider";

describe("BetAmountSlider", () => {
  it("renders the current value", () => {
    render(<BetAmountSlider max={50} value={12} onChange={jest.fn()} />);
    expect(screen.getByText("12 coins")).toBeTruthy();
  });

  it("increases the value on the plus stepper, clamped to max", () => {
    const onChange = jest.fn();
    render(<BetAmountSlider max={10} value={10} onChange={onChange} />);
    fireEvent.press(screen.getByLabelText("Increase bet"));
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it("decreases the value on the minus stepper, clamped to min", () => {
    const onChange = jest.fn();
    render(<BetAmountSlider min={1} max={50} value={1} onChange={onChange} />);
    fireEvent.press(screen.getByLabelText("Decrease bet"));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("jumps to the tapped position on the track", () => {
    const onChange = jest.fn();
    render(<BetAmountSlider min={1} max={50} value={1} onChange={onChange} />);
    const track = screen.getByLabelText("Bet amount");
    fireEvent(track, "layout", { nativeEvent: { layout: { width: 100, height: 10, x: 0, y: 0 } } });
    fireEvent.press(track, { nativeEvent: { locationX: 50 } });
    expect(onChange).toHaveBeenCalledWith(26);
  });

  it("exposes min/max/now for accessibility", () => {
    render(<BetAmountSlider min={1} max={50} value={20} onChange={jest.fn()} />);
    const track = screen.getByLabelText("Bet amount");
    expect(track.props.accessibilityValue).toEqual({ min: 1, max: 50, now: 20 });
  });
});
