import App from "./App";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("has correct welcome text", () => {
  render(<App />);
  expect(screen.getByRole("heading")).toHaveTextContent("Game of Life");
});

test("increment generation counter", () => {
  render(<App />);
  userEvent.click(screen.getByTitle("next"));
  expect(screen.getByTitle("gen_counter")).toHaveTextContent("1th generation");
});
test("reset generation counter", () => {
  render(<App />);
  userEvent.click(screen.getByTitle("reset"));
  expect(screen.getByTitle("gen_counter")).toHaveTextContent("0th generation");
});
test("clear generation counter", () => {
  render(<App />);
  userEvent.click(screen.getByTitle("clear"));
  expect(screen.getByTitle("gen_counter")).toHaveTextContent("0th generation");
});
test("start evolution", () => {
  render(<App />);
  userEvent.click(screen.getByTitle("start"));
  expect(screen.getByTitle("gen_counter")).toHaveTextContent("0th generation");
  expect(screen.getByTitle("tooltip")).toHaveTextContent("Pause");
  userEvent.click(screen.getByTitle("start"));
  expect(screen.getByTitle("tooltip")).toHaveTextContent("Start");
});
test("loads cells", async () => {
  render(<App />);
  fireEvent.click(screen.getByTitle("random"));
  const items = await screen.findAllByTitle("cell");
  expect(items).toHaveLength(900);
});
