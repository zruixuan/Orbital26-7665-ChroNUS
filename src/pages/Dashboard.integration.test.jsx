import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  cleanup,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "./Dashboard";

const firebaseMocks = vi.hoisted(() => ({
  currentUser: null,
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  addDoc: vi.fn(),
  onSnapshot: vi.fn(),
}));

vi.mock("../components/NavBar", () => ({
  default: () => <div>Mock NavBar</div>,
}));

vi.mock("../api/firebase", () => ({
  auth: {
    get currentUser() {
      return firebaseMocks.currentUser;
    },
  },
  db: {},
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn((_auth, callback) => {
    callback(firebaseMocks.currentUser);
    return vi.fn();
  }),
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(() => "mock-collection"),
  query: vi.fn(() => "mock-query"),
  where: vi.fn((_field, _operator, value) => ({
    value,
  })),
  doc: vi.fn((_db, collectionName, id) => ({
    collectionName,
    id,
  })),

  addDoc: firebaseMocks.addDoc,
  updateDoc: firebaseMocks.updateDoc,
  deleteDoc: firebaseMocks.deleteDoc,
  onSnapshot: firebaseMocks.onSnapshot,
}));

describe("Dashboard integration", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();

    firebaseMocks.currentUser = null;

    firebaseMocks.onSnapshot.mockImplementation((_query, callback) => {
      callback({
        forEach: () => {},
      });

      return vi.fn();
    });
  });

  test("newly created task appears immediately on Timeline", async () => {
    const user = userEvent.setup();

    render(<Dashboard />);

    await user.click(
      screen.getByRole("button", {
        name: /add task \/ event/i,
      })
    );

    await user.type(
      screen.getByPlaceholderText("Title"),
      "Integration Test Task"
    );

    await user.type(
      screen.getByPlaceholderText("Details or Subtasks"),
      "Created during integration testing"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Save",
      })
    );

    expect(
      screen.getByText("Integration Test Task")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Created during integration testing")
    ).toBeInTheDocument();
  });

  test("updating a Firebase task synchronizes the change with Firestore", async () => {
    const user = userEvent.setup();

    firebaseMocks.currentUser = {
      uid: "integration-test-user",
    };

    const firebaseTask = {
      id: "firebase-task-001",
      type: "task",
      title: "Original Firebase Task",
      detail: "Original task details",
      deadline: "2026-07-26 20:00",
      completed: false,
      importance: "Important",
      userId: "integration-test-user",
    };

    firebaseMocks.onSnapshot.mockImplementation((_query, callback) => {
      callback({
        forEach: (handler) => {
          handler({
            id: firebaseTask.id,
            data: () => {
              const { id, ...taskData } = firebaseTask;
              return taskData;
            },
          });
        },
      });

      return vi.fn();
    });

    render(<Dashboard />);

    const taskTitle = await screen.findByText("Original Firebase Task");

    await user.click(taskTitle);

    const titleInput = screen.getByPlaceholderText("Title");

    await user.clear(titleInput);
    await user.type(titleInput, "Updated Firebase Task");

    await user.click(
      screen.getByRole("button", {
        name: "Save",
      })
    );

    await waitFor(() => {
      expect(firebaseMocks.updateDoc).toHaveBeenCalledTimes(1);
    });

    expect(firebaseMocks.updateDoc).toHaveBeenCalledWith(
      {
        collectionName: "tasks",
        id: "firebase-task-001",
      },
      expect.objectContaining({
        type: "task",
        title: "Updated Firebase Task",
        detail: "Original task details",
        importance: "Important",
        completed: false,
        deadline: "2026-07-26 20:00",
        userId: "integration-test-user",
      })
    );
  });

  test("authenticated users can only access their own tasks", async () => {
    const userATask = {
      id: "user-a-task",
      type: "task",
      title: "User A Private Task",
      detail: "Only visible to User A",
      deadline: "2026-07-26 18:00",
      completed: false,
      importance: "Important",
      userId: "user-a",
    };

    const userBTask = {
      id: "user-b-task",
      type: "task",
      title: "User B Private Task",
      detail: "Only visible to User B",
      deadline: "2026-07-26 19:00",
      completed: false,
      importance: "Unimportant",
      userId: "user-b",
    };

    firebaseMocks.onSnapshot.mockImplementation((_query, callback) => {
      const currentTask =
        firebaseMocks.currentUser.uid === "user-a"
          ? userATask
          : userBTask;

      callback({
        forEach: (handler) => {
          handler({
            id: currentTask.id,
            data: () => {
              const { id, ...taskData } = currentTask;
              return taskData;
            },
          });
        },
      });

      return vi.fn();
    });

    firebaseMocks.currentUser = {
      uid: "user-a",
    };

    const firstRender = render(<Dashboard />);

    expect(
      await screen.findByText("User A Private Task")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("User B Private Task")
    ).not.toBeInTheDocument();

    firstRender.unmount();

    firebaseMocks.currentUser = {
      uid: "user-b",
    };

    render(<Dashboard />);

    expect(
      await screen.findByText("User B Private Task")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("User A Private Task")
    ).not.toBeInTheDocument();
  });
});