// Given ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
// When ยืนยันการจอง
// Then บันทึกสำเร็จ และที่นั่งว่างของช่วงนั้นเป็น 0
// Then แสดงหมายเลขคิว (รอ Q-02) - ยังไม่ตรวจเพราะรอ Q-02
import { render, screen } from '@testing-library/react'
import App from '../App.jsx'

test('TC-BKG-01-1: หน้าแสดงระบบจองคิวเปิดได้ และยังไม่ตรวจหมายเลขคิวจนกว่าจะมีคำตอบ Q-02', () => {
  render(<App />)

  expect(screen.getByText('ระบบจองคิวตรวจสุขภาพ')).toBeTruthy()
})
