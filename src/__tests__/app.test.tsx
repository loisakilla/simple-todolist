
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

function getInput() {
  return screen.getByPlaceholderText(/what needs to be done/i);
}

async function addTodo(text: string) {
  const input = getInput();
  await userEvent.type(input, text);
  await userEvent.keyboard("{Enter}");
}

async function toggleByText(text: string) {
  const itemText = await screen.findByText(text);
  const li = itemText.closest("li")!;
  const checkbox = within(li).getByRole("checkbox");
  await userEvent.click(checkbox);
}

describe("Mindbox Todo App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("adds a todo and updates remaining counter", async () => {
    render(<App />);
    expect(screen.getByTestId("left-count")).toHaveTextContent("0 items left");

    await addTodo("Тестовое задание");
    expect(screen.getByRole("list")).toHaveTextContent("Тестовое задание");
    expect(screen.getByTestId("left-count")).toHaveTextContent("1 item left");
  });

  test("toggle, filter and clear completed", async () => {
    render(<App />);
    await addTodo("A");
    await addTodo("B");

    await toggleByText("A");

    // Active filter should hide completed A
    await userEvent.click(screen.getByRole("tab", { name: /active/i }));
    expect(screen.queryByText("A")).not.toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();

    // Completed filter shows A
    await userEvent.click(screen.getByRole("tab", { name: /completed/i }));
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.queryByText("B")).not.toBeInTheDocument();

    // Clear completed removes A
    await userEvent.click(screen.getByRole("button", { name: /clear completed/i }));
    await userEvent.click(screen.getByRole("tab", { name: /all/i }));
    expect(screen.queryByText("A")).not.toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });
});
