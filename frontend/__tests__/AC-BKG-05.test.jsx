import React from "react";
import { render, screen } from "@testing-library/react";
import SlotPicker from "../src/pages/SlotPicker";

test("AC-BKG-05: SlotPicker shows remaining seats from mocked API", async () => {
  render(<SlotPicker dateFrom="2026-10-01" packageCode="PKG1" />);

  // Await for the mocked data to render
  expect(await screen.findByText(/Available Slots/)).toBeInTheDocument();
  expect(await screen.findByText(/Remaining: 3/)).toBeInTheDocument();
  expect(await screen.findByText(/Remaining: 5/)).toBeInTheDocument();
});
