import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";

import { renderHook, act } from "@testing-library/react";
import { useTimerEngine } from "./useTimerEngine";

vi.mock("../api/firebase", () => ({
  auth: {
    currentUser: null,
  },
  db: {},
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
}));

vi.mock("../services/achievementEngine", () => ({
  checkAndUnlockAchievements: vi.fn(),
}));

describe("useTimerEngine countdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(window, "confirm").mockReturnValue(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("decreases the countdown by one second", () => {
    const { result } = renderHook(() => useTimerEngine());

    expect(result.current.displaySeconds).toBe(1500);

    act(() => {
      result.current.toggleTimer();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.displaySeconds).toBe(1499);
  });

  it("stops the countdown at zero", () => {
    const { result } = renderHook(() => useTimerEngine());

    act(() => {
        result.current.handleDurationChange(1);
    });

    expect(result.current.displaySeconds).toBe(60);

    act(() => {
        result.current.toggleTimer();
    });

    act(() => {
        vi.advanceTimersByTime(60000);
    });

    expect(result.current.displaySeconds).toBe(0);
    expect(result.current.isActive).toBe(false);
});
});
