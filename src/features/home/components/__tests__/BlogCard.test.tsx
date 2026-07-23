import React from "react";
import { render, screen } from "@testing-library/react-native";
import { BlogCard } from "@/features/home/components/BlogCard";
import { BLOGS } from "@/mocks/fixtures";

describe("BlogCard", () => {
  it("renders the post's title, excerpt, category, and byline", () => {
    const post = BLOGS[0];
    render(<BlogCard post={post} />);
    expect(screen.getByText(post.title)).toBeTruthy();
    expect(screen.getByText(post.excerpt)).toBeTruthy();
    expect(screen.getByLabelText(post.category)).toBeTruthy();
    expect(screen.getByText(`${post.author} · ${post.readTime}`)).toBeTruthy();
  });
});
