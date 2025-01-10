import React from "react";
import { render, fireEvent, RenderResult } from "@testing-library/react";
import { Todos } from "./components/Todos";

describe("Todos Component", () => {
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(<Todos />);
  });

  test("should render input section", () => {
    const { getByTestId } = renderResult;
    const inputElement = getByTestId("todo-input");
    expect(inputElement).toBeInTheDocument();
  });

  test("should add a task on pressing 'Enter' key", () => {
    const { getByTestId, getByText } = renderResult;
    const inputElement = getByTestId("todo-input");
    fireEvent.change(inputElement, { target: { value: "Test Task" } });
    fireEvent.keyPress(inputElement, {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });
    const taskElement = getByText("Test Task");
    expect(taskElement).toBeInTheDocument();
  });

  test("should toggle task completion", () => {
    const { getByTestId, getByLabelText } = renderResult;
    const inputElement = getByTestId("todo-input");
    fireEvent.change(inputElement, { target: { value: "Test Task" } });
    fireEvent.keyPress(inputElement, {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });
    const checkbox = getByLabelText("Test Task") as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  test("should delete a task", () => {
    const { getByTestId, queryByText } = renderResult;
    const inputElement = getByTestId("todo-input");
    fireEvent.change(inputElement, { target: { value: "Test Task" } });
    fireEvent.keyPress(inputElement, {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });
    const deleteButton = document.querySelector(
      ".TaskItem__delete-button"
    ) as HTMLButtonElement;
    fireEvent.click(deleteButton);
    const taskElement = queryByText("Test Task");
    expect(taskElement).toBeNull();
  });

  test("should clear completed tasks", () => {
    const { getByTestId, getByText, queryByText } = renderResult;
    const inputElement = getByTestId("todo-input");
    fireEvent.change(inputElement, { target: { value: "Test Task" } });
    fireEvent.keyPress(inputElement, {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });
    const checkbox = document.querySelector(
      ".TaskItem__checkbox"
    ) as HTMLInputElement;
    fireEvent.click(checkbox);
    const clearButton = getByText("Clear Completed");
    fireEvent.click(clearButton);
    const taskElement = queryByText("Test Task");
    expect(taskElement).not.toBeInTheDocument();
  });

  test("should filter tasks", () => {
    const { getByTestId, getByText } = renderResult;
    const inputElement = getByTestId("todo-input");
    fireEvent.change(inputElement, { target: { value: "Test Task" } });
    fireEvent.keyPress(inputElement, {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });
    const checkbox = document.querySelector(
      ".TaskItem__checkbox"
    ) as HTMLInputElement;
    fireEvent.click(checkbox);
    const filterButton = getByText("Completed");
    fireEvent.click(filterButton);
    const taskElement = getByText("Test Task");
    expect(taskElement).toBeInTheDocument();
  });
});
