import React from "react";
import { render, screen } from "@testing-library/react";
import SlotPicker from "../src/pages/SlotPicker";

test("AC-BKG-05: SlotPicker shows remaining seats from mocked API", async () => {
  render(<SlotPicker dateFrom="2026-10-01" packageCode="PKG1" />);

  // Await for the mocked data to render
  const header = await screen.findByText(/Available Slots/);
  const r3 = await screen.findByText(/Remaining: 3/);
  const r5 = await screen.findByText(/Remaining: 5/);

  expect(header).toBeTruthy();
  expect(r3).toBeTruthy();
  expect(r5).toBeTruthy();
  expect(alert.textContent).toContain('ช่วงเวลาเต็ม');
expect(screen.getAllByText('เลือกช่วงนี้').length).toBe(3);
  
});
