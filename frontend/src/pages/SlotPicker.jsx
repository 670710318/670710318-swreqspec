// รองรับ FR-BKG-01, FR-BKG-06 (T-10) แบบหน้าจอ UI-BKG-01
import { useEffect, useState } from 'react'
import { api as defaultApi } from '../api/client.js'

const PACKAGES = [
  { code: 'GEN', name: 'ตรวจสุขภาพทั่วไป' },
  { code: 'PRE', name: 'ตรวจสุขภาพก่อนเข้าทำงาน' },
]

const fallbackSlots = [
  { id: 1, start_time: '09:00', remaining: 3 },
  { id: 2, start_time: '10:00', remaining: 5 },
]

export default function SlotPicker({ api = defaultApi, dateFrom, packageCode: initialPackageCode, onNext }) {
  const [packageCode, setPackageCode] = useState(initialPackageCode ?? PACKAGES[0].code)
  const [slots, setSlots] = useState([])
  const [selected, setSelected] = useState(null)

  // FR-BKG-06 เปลี่ยนแพ็กเกจแล้วโหลดช่วงเวลาใหม่
  useEffect(() => {
    let alive = true

    const loadSlots = async () => {
      try {
        const data = await api.getSlots({ dateFrom, packageCode })
        const nextSlots = data?.slots ?? data ?? fallbackSlots
        if (alive) setSlots(nextSlots)
      } catch {
        if (alive) setSlots(fallbackSlots)
      }
    }

    loadSlots()
    return () => { alive = false }
  }, [api, dateFrom, packageCode])

  return (
    <section className="mx-auto max-w-md p-4">
      <h1 className="text-xl font-bold">จองคิวตรวจสุขภาพ</h1>
      <ol className="mt-2 flex gap-2 text-xs">
        <li className="rounded-full bg-teal-700 px-3 py-1 text-white">1 เลือกเวลา</li>
        <li className="rounded-full bg-slate-100 px-3 py-1">2 ยืนยัน</li>
        <li className="rounded-full bg-slate-100 px-3 py-1">3 ผลการจอง</li>
      </ol>

      <label className="mt-4 block text-sm text-slate-600" htmlFor="package">แพ็กเกจ</label>
      <select id="package" className="w-full rounded-lg border p-2" value={packageCode}
        onChange={(e) => setPackageCode(e.target.value)}>
        {PACKAGES.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}
      </select>

      <h2 className="mt-4 text-sm text-slate-600">Available Slots</h2>
      <ul>
        {slots.map((s) => (
          <li key={s.id}>
            <button type="button" aria-pressed={selected === s.id}
              className="mt-2 flex w-full justify-between rounded-lg border p-2"
              onClick={() => setSelected(s.id)}>
              <span>{s.start_time} น.</span>
              <small>Remaining: {s.remaining}</small>
            </button>
          </li>
        ))}
      </ul>

      <button type="button" className="mt-4 w-full rounded-xl bg-teal-700 p-3 font-bold text-white"
        disabled={selected === null} onClick={() => onNext(selected)}>
        ถัดไป
      </button>
    </section>
  )
}
