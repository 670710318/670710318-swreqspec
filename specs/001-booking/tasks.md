# Tasks: จองคิวตรวจสุขภาพ (Booking)
Spec ID: SPEC-BKG-001
Plan: plan.md
วันที่: 2569-09-22

สรุป: 12 งาน, 1 งานที่รอ Open Questions

### T-01 สร้าง migration และตารางฐานข้อมูล
- รองรับ: CON-TECH-01, DOM-PDPA-01, IF-HIS-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-03/T-04
- ไฟล์ที่แตะ: backend/app/db/models.py, backend/app/db/migrations/001_init.py
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: migration สร้างตาราง `slots`, `bookings`, `audit_logs` และรัน migrations ในสภาพแวดล้อมทดสอบได้
- สถานะ: พร้อมทำ

### T-02 เขียน service สำหรับคำนวณช่วงว่างและ GET /slots
- รองรับ: FR-BKG-01, FR-BKG-06, NFR-PERF-01
- ตรวจด้วย: AC-BKG-05 (ทดสอบประสิทธิภาพแบบย่อส่วน) และ test ที่คำนวณ remaining ถูกต้อง
- ไฟล์ที่แตะ: backend/app/slots/service.py, backend/app/slots/router.py
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: GET /slots คืนรายการช่วงเวลาและ `remaining` ถูกต้องและมี test ชุดหนึ่งรวมการเรียกพร้อมกัน 200 ครั้งแบบย่อส่วน
- สถานะ: พร้อมทำ

### T-03 สร้าง POST /bookings พื้นฐาน (ตัดที่นั่งและบันทึก)
- รองรับ: FR-BKG-04
- ตรวจด้วย: AC-BKG-01
- ไฟล์ที่แตะ: backend/app/booking/service.py, backend/app/booking/router.py
- ต้องทำหลัง: T-01, T-02
- เสร็จเมื่อ: POST /bookings สร้างเรคคอร์ด bookings, ลด `remaining` ของ slot และ test `test_AC_BKG_01` ผ่าน
- สถานะ: พร้อมทำ

### T-04 ป้องกันการจองซ้ำในวันเดียวกัน
- รองรับ: FR-BKG-02
- ตรวจด้วย: AC-BKG-02
- ไฟล์ที่แตะ: backend/app/booking/service.py, tests/test_AC_BKG_02.py
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: ถ้าผู้ใช้มี booking ที่ยังไม่ใช้ในวันเดียวกัน API ปฏิเสธ (409) และคืนหมายเลขคิวเดิม; test `test_AC_BKG_02` ผ่าน
- สถานะ: พร้อมทำ

### T-05 เสนอช่วงเวลาใกล้เคียงเมื่อเต็ม (409 พร้อม 3 ช่วง)
- รองรับ: FR-BKG-03
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: backend/app/booking/service.py, backend/app/booking/router.py, tests/test_AC_BKG_03.py
- ต้องทำหลัง: T-03, T-02
- เสร็จเมื่อ: เมื่อ POST /bookings พบเต็ม ระบบคืน 409 พร้อมรายการ 3 ช่วงที่ใกล้ที่สุดตามข้อกำหนด และ test `test_AC_BKG_03` ผ่าน
- สถานะ: พร้อมทำ

### T-06 วางงานส่งข้อความลงคิวและนโยบายส่งซ้ำ
- รองรับ: IF-NOT-01, ASM-03, FR-BKG-05
- ตรวจด้วย: AC-BKG-04
- ไฟล์ที่แตะ: backend/app/notify/queue.py, backend/app/booking/service.py, tests/test_AC_BKG_04.py
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: POST /bookings วางงานลงคิวแบบ asynchronous และระบบมีนโยบายส่งซ้ำ (3 ครั้ง ห่าง 5 นาที) และ test `test_AC_BKG_04` ผ่าน
- สถานะ: พร้อมทำ

### T-07 audit log middleware
- รองรับ: DOM-PDPA-01
- ตรวจด้วย: AC-BKG-06
- ไฟล์ที่แตะ: backend/app/audit/middleware.py, backend/app/db/models.py, tests/test_AC_BKG_06.py
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: การเรียกดูการจองสร้าง `audit_logs` ที่มี `actor_id`, `accessed_at`, `hn` และ test `test_AC_BKG_06` ผ่าน
- สถานะ: พร้อมทำ

### T-08 ค้น HN จาก HIS (mock ใน test)
- รองรับ: IF-HIS-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นอินทิเกรชันพื้นฐาน
- ไฟล์ที่แตะ: backend/app/his/client.py, tests/conftest.py
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: มี client ที่เรียก HIS (mocked ใน test) คืน `hn` และ tests ที่ใช้ client ทำงานได้
- สถานะ: พร้อมทำ

### T-09 เพิ่มฟิลด์ `queue_no` ใน bookings และช่องเก็บรอ Q-02
- รองรับ: FR-BKG-04 (ส่วนแสดง queue_no), Q-02 (รอคำตอบ)
- ตรวจด้วย: ไม่มี AC ตรง ๆ (รอ Q-02) แต่ต้องมี migration ให้มีคอลัมน์ `queue_no`
- ไฟล์ที่แตะ: backend/app/db/models.py, backend/app/db/migrations/001_init.py
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: ตาราง `bookings` มีคอลัมน์ `queue_no` แต่รูปแบบการออกเลขยังไม่บังคับ; สถานะ: รอ Q-02
- สถานะ: รอ Q-02

### T-10 หน้าจอ SlotPicker (API จำลอง)
- รองรับ: FR-BKG-01, FR-BKG-06, NFR-USE-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นหน้าจอเริ่มต้น; มี test หน้าจอสำหรับ UX (Vitest)
- ไฟล์ที่แตะ: frontend/src/pages/SlotPicker.jsx, frontend/src/api/client.js, frontend/__tests__/AC-BKG-05.test.jsx
- ต้องทำหลัง: ไม่มี (ใช้ API จำลองตามกฎ plan)
- เสร็จเมื่อ: หน้าจอโหลดช่วงเวลาจาก API จำลอง และแสดง `remaining` ให้ผู้ใช้เลือก; หน้าจอทดสอบผ่าน Vitest
- สถานะ: พร้อมทำ

### T-11 หน้ายืนยัน ConfirmBooking (จัดการ 409 และแสดง 3 ตัวเลือก)
- รองรับ: FR-BKG-03, FR-BKG-04
- ตรวจด้วย: AC-BKG-03 (หน้าจอ) และ AC-BKG-01/04 (ผลแสดง)
- ไฟล์ที่แตะ: frontend/src/pages/ConfirmBooking.jsx, frontend/__tests__/AC-BKG-03.test.jsx
- ต้องทำหลัง: T-10
- เสร็จเมื่อ: หน้าจอเรียก POST /bookings กับ API จำลอง และเมื่อได้ 409 แสดงข้อความ "ช่วงเวลาเต็ม" พร้อม 3 ปุ่มตัวเลือก และ test หน้านี้ผ่าน
- สถานะ: พร้อมทำ

### T-12 ต่อหน้าจอกับ API จริง (integration)
- รองรับ: FR-BKG-01..FR-BKG-06 (รวมทุก API ที่หน้าเรียก)
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นขั้นตอนผสานระบบ
- ไฟล์ที่แตะ: frontend/*, backend/app/* ตาม page ที่ใช้
- ต้องทำหลัง: T-02, T-03, T-05, T-06, T-10, T-11
- เสร็จเมื่อ: หน้าจอทำงานกับ backend จริงผ่าน proxy `/api` และ integration smoke test ผ่าน
- สถานะ: พร้อมทำ (แต่ Q-02 อาจจำเป็นต้องรอ)


## ตารางตรวจความครบ
- AC-BKG-01: T-03
- AC-BKG-02: T-04
- AC-BKG-03: T-05, T-11
- AC-BKG-04: T-06, T-03
- AC-BKG-05: T-02, T-10
- AC-BKG-06: T-07

## ตาราง Constraints
- CON-TECH-01: T-01, T-09
- DOM-PDPA-01: T-01, T-07
- IF-IDP-01: เตรียมใน auth/idp.py (นอกขอบเขต tasks นี้) -> ไม่มี task แยกเพราะ plan ระบุว่าจะมี
- IF-HIS-01: T-08
- IF-NOT-01: T-06

## สิ่งที่ยังไม่ทำ / Open Questions
- Q-02: รูปแบบหมายเลขคิวและการรีเซ็ตรายวันหรือไม่ — T-09 รอ Q-02


---

(บันทึก: ห้ามเริ่มทำงานพวก T-02..T-12 จนกว่าทีมจะสั่งแยกต่างหากตามกติกา)
