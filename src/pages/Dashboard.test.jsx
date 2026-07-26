import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "./Dashboard";
import { MemoryRouter } from "react-router-dom";

describe("Timeline date navigation", () => {
    it("moves to the next date when the next button is clicked", async () => {
    const user = userEvent.setup();

    render(
        <MemoryRouter>
        <Dashboard />
        </MemoryRouter>
    );

    const currentDateText = new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date());

    expect(screen.getByText(currentDateText)).toBeInTheDocument();

    const nextButton = screen.getByRole("button", {
        name: "Next date",
    });

    await user.click(nextButton);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowDateText = new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(tomorrow);

    expect(screen.getByText(tomorrowDateText)).toBeInTheDocument();
    });

    it("moves to the previous date when the previous button is clicked", async () => {
    const user = userEvent.setup();

    render(
        <MemoryRouter>
        <Dashboard />
        </MemoryRouter>
    );

    const previousButton = screen.getByRole("button", {
        name: "Previous date",
    });

    await user.click(previousButton);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayDateText = new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(yesterday);

    expect(screen.getByText(yesterdayDateText)).toBeInTheDocument();
    });

    it("opens the task creation modal", async () => {
    const user = userEvent.setup();

    render(
        <MemoryRouter>
        <Dashboard />
        </MemoryRouter>
    );

    const addButton = screen.getByRole("button", {
        name: /Add Task \/ Event/i,
    });

    await user.click(addButton);

    expect(
        screen.getByRole("heading", { name: "New Entry" })
    ).toBeInTheDocument();

    expect(
        screen.getByPlaceholderText("Title")
    ).toBeInTheDocument();

    expect(
        screen.getByPlaceholderText("Details or Subtasks")
    ).toBeInTheDocument();
    });

    it("creates a new task with the entered title", async () => {
    const user = userEvent.setup();

    render(
        <MemoryRouter>
        <Dashboard />
        </MemoryRouter>
    );

    await user.click(
        screen.getByRole("button", {
        name: /Add Task \/ Event/i,
        })
    );

    const titleInput = screen.getByPlaceholderText("Title");

    await user.type(titleInput, "Finish testing report");

    await user.click(
        screen.getByRole("button", {
        name: "Save",
        })
    );

    expect(
        screen.getByText("Finish testing report")
    ).toBeInTheDocument();
    });
});