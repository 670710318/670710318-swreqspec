# RTM: จองคิวตรวจสุขภาพ (Booking)
อ้างอิง: spec.md SPEC-BKG-001 Draft v2 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-10-07 09:00 | test: backend 7 ผ่าน, frontend 4 ผ่าน 1 ไม่ผ่าน

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-BKG-01 | AC-BKG-05 | T-02 | backend/app/slots/service.py: list_available_slots; backend/app/slots/router.py: get_slots | backend/tests/test_AC_BKG_05.py::test_AC_BKG_05 (ผ่าน) | ครบ |
| FR-BKG-02 | AC-BKG-02 | T-04 | backend/app/booking/service.py: create_booking | ไม่มี | ยังไม่ถึง |
| FR-BKG-03 | AC-BKG-03 | T-05, T-11, T-12 | frontend/src/pages/ConfirmBooking.jsx: ConfirmBooking; backend/app/booking/router.py: create_booking | frontend/src/__tests__/AC-BKG-03.test.jsx (ผ่าน) | ครบ |
| FR-BKG-04 | AC-BKG-01 | T-03, T-06 | backend/app/booking/service.py: create_booking; backend/app/booking/router.py: create_booking | backend/tests/test_AC_BKG_01.py::test_AC_BKG_01, test_TC_BKG_01_1_success, test_TC_BKG_01_2_boundary_remaining_zero (ผ่าน) | รอ Q-xx |
| FR-BKG-05 | AC-BKG-04 | T-07 | ไม่มีโค้ดคิวส่งข้อความซ้ำหรือ retry ภายใน 5 นาที | ไม่มี | ยังไม่ถึง |
| FR-BKG-06 | ไม่มี AC | T-10, T-12 | backend/app/slots/service.py: list_available_slots (กรอง package_code) | ไม่มี | ช่องโหว่ |
| NFR-PERF-01 | AC-BKG-05 | T-02 | backend/app/slots/service.py: list_available_slots | backend/tests/test_AC_BKG_05.py::test_AC_BKG_05 (ผ่าน) | ครบ |
| NFR-SEC-01 | ไม่มี AC | ไม่มี task | ไม่มี TLS 1.2+ หรือการตั้งค่ารองรับ HTTPS | ไม่มี | ยังไม่ถึง |
| NFR-REL-02 | AC-BKG-04 | T-07 | ไม่มี retry queue หรือความล่าช้าภายใน 5 นาที | ไม่มี | ยังไม่ถึง |
| NFR-USE-01 | ไม่มี AC | ไม่มี task | ไม่มี test หรือกระบวนการวัด 8/10 คน | ไม่มี | ยังไม่ถึง |
| CON-TECH-01 | ไม่มี AC | T-01 | backend/app/config.py: DATABASE_URL = sqlite:///./dev.db | ไม่มี | ช่องโหว่ |
| DOM-PDPA-01 | AC-BKG-06 | T-08 | backend/app/db/models.py: AuditLog; backend/app/main.py: lifespan | ไม่มี | ยังไม่ถึง |
| IF-IDP-01 | AC-BKG-01, AC-BKG-03 | T-03 | backend/app/auth/idp.py: get_verified_hn | backend/tests/test_AC_BKG_01.py::test_TC_BKG_01_3_unverified_user (ผ่าน) | ครบ |
| IF-HIS-01 | ไม่มี AC | T-09 | backend/app/booking/router.py: BookingRequest.national_id; backend/app/booking/router.py: create_booking | ไม่มี | ช่องโหว่ |
| IF-NOT-01 | AC-BKG-04 | T-07 | ไม่มี async notify queue หรือ retry ตาม ASM-03 | ไม่มี | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| backend/app/config.py: DATABASE_URL | CON-TECH-01 | ไม่ใช่ | ค่าเริ่มต้นเป็น SQLite จึงผิดจากข้อบังคับของโรงพยาบาลที่ระบุให้ใช้ PostgreSQL |
| backend/app/booking/router.py: BookingRequest | IF-HIS-01 | ไม่ใช่ | รับ field national_id และ log ข้อมูลนี้ แม้จะไม่เก็บในตาราง แต่ยังขัดกับ constraint ที่ห้ามเก็บเลขบัตรประชาชนในบริบทนี้ |
| backend/app/booking/service.py: create_booking | FR-BKG-02 | ไม่ใช่ | ไม่มีการปฏิเสธเมื่อผู้รับบริการมีคิวที่ยังไม่ได้ใช้ในวันเดียวกัน |
| backend/app/booking/router.py: create_booking | FR-BKG-03 | บางส่วน | คืน 409 detail "ช่วงเวลาเต็ม" แต่ไม่มี response alternatives ตาม spec ที่ต้องมี 3 ตัวเลือก พร้อมวันและเวลา |
| backend/app/auth/idp.py: get_verified_hn | IF-IDP-01 | ใช่ | ตรวจ token ที่มีรูปแบบ "Bearer verified:<HN>" และปฏิเสธเมื่อยังไม่ได้ยืนยัน |
| backend/app/slots/service.py: list_available_slots | FR-BKG-01, FR-BKG-06 | บางส่วน | ดึงช่วงว่างได้และกรองตามแพ็กเกจ แต่ยังไม่มี AC เพื่อยืนยันสิ่งนี้อย่างเป็นทางการ |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง
ทีมตัดสิน: แก้โค้ด / แก้ spec / เพิ่ม Q-xx / ไม่ใช่ปัญหา (พร้อมเหตุผล 1 บรรทัด)

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | FR ไม่มี AC | spec.md / plan.md | FR-BKG-06 | โค้ดมีการกรอง package_code แต่ spec ไม่มี AC แบบยืนยันเรื่องเปลี่ยนแพ็กเกจ จึงเป็นช่องโหว่ของ requirement |  |
| F-002 | ละเมิด Constraint | backend/app/config.py: DATABASE_URL | CON-TECH-01 | ค่าเริ่มต้นที่ใช้เป็น SQLite ทำให้โค้ดไม่สอดคล้องกับข้อบังคับของโรงพยาบาลให้ใช้ PostgreSQL |  |
| F-003 | ละเมิด Constraint | backend/app/booking/router.py: BookingRequest; backend/app/booking/router.py: create_booking | IF-HIS-01 | request model และ log ยังรับ/พิมพ์ national_id แม้จะไม่เก็บลงฐานข้อมูลก็ตาม ซึ่งขัดกับเงื่อนไขที่ห้ามเก็บเลขบัตรประชาชน |  |
| F-004 | เดา Q-xx | backend/app/booking/service.py: next_queue_no | FR-BKG-04, Q-02 | โค้ดกำหนดรูปแบบ "A001" และรีเซ็ตทุกวัน โดยอิงความคาดหมายของทีมโดยไม่รอคำตอบจากเจ้าหน้าที่เวชระเบียน |  |
| F-005 | โค้ดไม่มี FR | backend/app/booking/service.py: create_booking | FR-BKG-02 | ไม่มีการตรวจว่าผู้รับบริการมีคิวที่ยังไม่ได้ใช้ในวันเดียวกัน จึงยังไม่ปฏิเสธการจองซ้ำตาม spec |  |
| F-006 | โค้ดไม่มี FR | backend/app/booking/router.py: create_booking | FR-BKG-05 | ไม่มีการวางงานแจ้งเตือนลงคิว ส่งซ้ำภายใน 5 นาที หรือบันทึกรายการค้างส่งตาม ASM-03 |  |
| F-007 | โค้ดไม่มี FR | backend/app/main.py: lifespan; backend/app/db/models.py: AuditLog | DOM-PDPA-01 | ตาราง audit log มีแต่ยังไม่มี middleware หรือการบันทึก audit log จริงเมื่อมีการเข้าถึงข้อมูลการจอง |  |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
| - | ไม่มีข้อค้นพบที่แก้แล้วในรอบนี้ | ตรวจรอบนี้ยังไม่พบข้อค้นพบที่ผ่านการแก้ไขแล้ว |
