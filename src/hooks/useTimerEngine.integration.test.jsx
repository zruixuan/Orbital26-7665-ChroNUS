import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useTimerEngine } from "./useTimerEngine";

const mocks = vi.hoisted(() => ({
  addDoc: vi.fn(),
  checkAndUnlockAchievements: vi.fn(),
}));

vi.mock("../api/firebase", () => ({
  auth: {
    currentUser: {
      uid: "timer-test-user",
    },
  },
  db: {},
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn((_db, collectionName) => collectionName),
  addDoc: mocks.addDoc,
}));

vi.mock("../services/achievementEngine", () => ({
  checkAndUnlockAchievements: mocks.checkAndUnlockAchievements,
}));

describe("Timer and Achievement integration", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    mocks.addDoc.mockResolvedValue({
      id: "test-session-id",
    });

    mocks.checkAndUnlockAchievements.mockResolvedValue([
      "test-achievement",
    ]);

    vi.spyOn(window, "confirm").mockReturnValue(false);
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test("completed focus session is saved and sent to achievement engine", async () => {
    const { result } = renderHook(() => useTimerEngine());

    act(() => {
      result.current.handleDurationChange(1 / 60);
    });

    expect(result.current.focusDuration).toBe(1 / 60);
    expect(result.current.timeLeft).toBe(1);

    act(() => {
      result.current.toggleTimer();
    });

    expect(result.current.isActive).toBe(true);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(mocks.addDoc).toHaveBeenCalledTimes(1);

    expect(mocks.addDoc).toHaveBeenCalledWith(
      "sessions",
      expect.objectContaining({
        userId: "timer-test-user",
        duration: 1 / 60,
        timerMode: "countdown",
        isPomodoro: false,
        completedTasks: [],
        completedEvents: [],
        createdAt: expect.any(Date),
        startTime: expect.any(Date),
        endTime: expect.any(Date),
      })
    );

    expect(
      mocks.checkAndUnlockAchievements
    ).toHaveBeenCalledTimes(1);

    expect(
      mocks.checkAndUnlockAchievements
    ).toHaveBeenCalledWith(
      "timer-test-user",
      expect.objectContaining({
        duration: 1 / 60,
        timerMode: "countdown",
        isPomodoro: false,
        startTime: expect.any(Date),
        endTime: expect.any(Date),
      })
    );
  });
});