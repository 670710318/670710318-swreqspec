// รองรับ: FR-BKG-01, IF-HIS-01 (client side caller)
export async function getSlots({ dateFrom, packageCode } = {}) {
  // API จำลอง: คืนค่าตัวอย่างเพื่อให้หน้าจอทำงานโดยไม่ต้องมี backend
  // ฟิลด์: id, slot_date, start_time, remaining
  return Promise.resolve([
    { id: 1, slot_date: "2026-10-01", start_time: "09:00", remaining: 3 },
    { id: 2, slot_date: "2026-10-01", start_time: "10:00", remaining: 0 },
    { id: 3, slot_date: "2026-10-02", start_time: "09:00", remaining: 5 },
  ]);
}
// จุดเดียวที่หน้าจอใช้เรียก API หลังบ้าน (ตามสัญญา API ใน plan.md ข้อ 4)
// ตอน test ให้ส่ง client จำลองเข้าไปในหน้าจอแทน ไม่ต้องรันหลังบ้านจริง
// เรียกผ่าน /api (ดู proxy ใน vite.config.js) หลังบ้านต้องรันอยู่ที่ port 8000
const BASE = import.meta.env.VITE_API_BASE ?? '/api'

export const api = {
  async getSlots({ dateFrom, packageCode }) {
    const q = new URLSearchParams({ date_from: dateFrom, package_code: packageCode })
    const res = await fetch(`${BASE}/slots?${q}`)
    return res.json()
  },
  async createBooking({ slotId }) {
    const res = await fetch(`${BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot_id: slotId }),
    })
    return { status: res.status, body: await res.json() }
  },
}
