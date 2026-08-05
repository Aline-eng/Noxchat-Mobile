import { useWallet } from "@/features/games/api/useWallet";
import { WALLET } from "@/mocks/fixtures";

describe("useWallet", () => {
  it("returns the mock wallet summary", () => {
    expect(useWallet()).toEqual(WALLET);
  });
});
