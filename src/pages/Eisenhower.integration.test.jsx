import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Eisenhower from "./Eisenhower";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const urgentImportantTask = {
  id: "task-1",
  title: "Submit Orbital Report",
  detail: "Complete the final testing section",
  deadline: tomorrow.toISOString(),
  importance: "Important",
  completed: false,
  type: "task",
  userId: "test-user",
};

vi.mock("../api/firebase", () => ({
  auth: {
    currentUser: {
      uid: "test-user",
    },
  },
  db: {},
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn((auth, callback) => {
    callback({
      uid: "test-user",
    });

    return vi.fn();
  }),
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn((db, collectionName) => ({
    collectionName,
  })),

  where: vi.fn(),

  query: vi.fn((collectionReference) => collectionReference),

  doc: vi.fn((db, collectionName, documentId) => ({
    collectionName,
    documentId,
  })),

  setDoc: vi.fn(),

  onSnapshot: vi.fn((reference, successCallback) => {
    if (reference.collectionName === "task") {
      successCallback({
        docs: [
          {
            id: urgentImportantTask.id,
            data: () => urgentImportantTask,
          },
        ],
      });
    }

    if (reference.collectionName === "tasks") {
      successCallback({
        docs: [],
      });
    }

    if (reference.collectionName === "eisenhowerSettings") {
      successCallback({
        exists: () => false,
        data: () => ({}),
      });
    }

    return vi.fn();
  }),
}));

describe("Task and Eisenhower integration", () => {
  it("places an important urgent task in the correct quadrant", async () => {
    render(
      <MemoryRouter>
        <Eisenhower />
      </MemoryRouter>
    );

    const quadrant = screen.getByTestId(
      "important-urgent-quadrant"
    );

    expect(
      await within(quadrant).findByText("Submit Orbital Report")
    ).toBeInTheDocument();
  });
});