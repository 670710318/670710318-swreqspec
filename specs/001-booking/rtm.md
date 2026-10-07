# RTM: จองคิวตรวจสุขภาพ (Booking)
อ้างอิง: spec.md Draft v2 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-10-07 08:40 | test: 9 ผ่าน 1 ไม่ผ่าน

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-BKG-01 | AC-BKG-05 | T-02 | backend/app/slots/service.py: list_available_slots; backend/app/slots/router.py: get_slots | backend/tests/test_AC_BKG_05.py::test_AC_BKG_05 (ผ่าน) | ครบ |
| FR-BKG-02 | AC-BKG-02 | T-04 | backend/app/booking/service.py: create_booking (ไม่มีตรวจคิวที่ยังไม่ได้ใช้วันเดียวกัน) | ไม่มี | ยังไม่ถึง |
| FR-BKG-03 | AC-BKG-03 | T-05, T-11, T-12 | ไม่มีโค้ดที่แจ้ง “ช่วงเวลาเต็ม” และเสนอ 3 ช่วงที่ใกล้ที่สุด | ไม่มี | ยังไม่ถึง |
| FR-BKG-04 | AC-BKG-01 | T-03, T-06 | backend/app/booking/service.py: create_booking; backend/app/booking/router.py: create_booking | backend/tests/test_AC_BKG_01.py::test_AC_BKG_01, test_TC_BKG_01_1_success, test_TC_BKG_01_2_boundary_remaining_zero (ผ่าน) แต่ไม่ตรวจรูปแบบเลขคิว | รอ Q-xx |
| FR-BKG-05 | AC-BKG-04 | T-07 | ไม่มีโค้ดคิวส่งข้อความซ้ำ หรือทดสอบส่งซ้ำภายใน 5 นาที | ไม่มี | ยังไม่ถึง |
| FR-BKG-06 | ไม่มี AC | T-10, T-12 | backend/app/slots/service.py: list_available_slots (กรอง package_code) | ไม่มี | ช่องโหว่ |
| NFR-PERF-01 | AC-BKG-05 | T-02 | backend/app/slots/service.py: list_available_slots | backend/tests/test_AC_BKG_05.py::test_AC_BKG_05 (ผ่าน) | ครบ |
| NFR-SEC-01 | ไม่มี AC | ไม่มี task | ไม่มีโค้ด TLS 1.2+ หรือการตั้งค่า HTTPS สำหรับข้อมูลการจอง | ไม่มี | ยังไม่ถึง |
| NFR-REL-02 | AC-BKG-04 | T-07 | ไม่มีคิวส่งซ้ำ หรือเวลา 5 นาที | ไม่มี | ยังไม่ถึง |
| NFR-USE-01 | ไม่มี AC | ไม่มี task | ไม่มี test ผู้ใช้ใหม่ 8/10 คน หรือกระบวนการทดสอบจริง | ไม่มี | ยังไม่ถึง |
| CON-TECH-01 | ไม่มี AC | T-01 | backend/app/config.py: DATABASE_URL ที่ค่าเริ่มต้นเป็น sqlite:///./dev.db | ไม่มี | ช่องโหว่ |
| DOM-PDPA-01 | AC-BKG-06 | T-08 | backend/app/db/models.py: AuditLog มีตาราง; ไม่มี middleware หรือการเรียกเขียน log จริง | ไม่มี | ยังไม่ถึง |
| IF-IDP-01 | AC-BKG-01, AC-BKG-03 | T-03 | backend/app/auth/idp.py: get_verified_hn | backend/tests/test_AC_BKG_01.py::test_TC_BKG_01_3_unverified_user (ผ่าน) | ครบ |
| IF-HIS-01 | ไม่มี AC | T-09 | backend/app/booking/router.py: BookingRequest.national_id + logger.info(..., national_id) ; ไม่มี HIS lookup และไม่มีการค้น HN จากเลขบัตร | ไม่มี | ช่องโหว่ |
| IF-NOT-01 | AC-BKG-04 | T-07 | ไม่มีคิวส่งข้อความแบบ async และไม่มี queue retry ตาม ASM-03 | ไม่มี | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| backend/app/slots/router.py: get_slots | FR-BKG-01, FR-BKG-06 | บางส่วน | คืนช่วงเวลาว่างและกรองตาม package_code ทำได้ แต่ไม่มี AC และไม่มี UI ที่ใช้จริง |
| backend/app/booking/router.py: create_booking | FR-BKG-04, IF-IDP-01 | บางส่วน | บันทึกและตัดที่นั่งทำได้ แต่ไม่มีตรวจจองซ้ำวันเดียวกันและยังรอ Q-02 |
| backend/app/auth/idp.py: get_verified_hn | IF-IDP-01 | ใช่ | ตรวจ token "Bearer verified:<HN>" ตามความจำลองและปฏิเสธเมื่อยังไม่ได้ยืนยัน |
| backend/app/db/models.py: Booking | IF-HIS-01, FR-BKG-04 | ไม่ใช่ | ตารางเก็บเฉพาะ hn ตาม spec แต่ request model มี national_id และ log ระบุ national_id ซึ่งไม่ควรส่งหรือบันทึกโดยไม่จำเป็น |
| backend/app/config.py: DATABASE_URL | CON-TECH-01 | ไม่ใช่ | ค่าเริ่มต้นเป็น sqlite:///./dev.db แทน PostgreSQL ตาม requirement บังคับ |
| backend/app/db/models.py: AuditLog | DOM-PDPA-01 | ไม่ใช่ | มีตารางแล้ว แต่ไม่มี logic ที่บันทึก audit log จริงจากการเข้าถึงข้อมูลการจอง |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง
ทีมตัดสิน: แก้โค้ด / แก้ spec / เพิ่ม Q-xx / ไม่ใช่ปัญหา (พร้อมเหตุผล 1 บรรทัด)

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | FR ไม่มี AC | spec.md / plan.md | FR-BKG-06 | FR-BKG-06 มีโค้ดกรอง package_code แต่ spec ไม่มี AC ที่ตรวจเรื่องนี้ จึงเป็นช่องโหว่ของ requirement |  |
| F-002 | ละเมิด Constraint | backend/app/config.py: DATABASE_URL | CON-TECH-01 | ค่าเริ่มต้นเป็น SQLite จึงไม่บังคับใช้ PostgreSQL เหมือน requirement ที่ระบุชัด |  |
| F-003 | ละเมิด Constraint | backend/app/booking/router.py: BookingRequest; backend/app/booking/router.py: create_booking | IF-HIS-01 | request model มี national_id และ log ระบุ national_id แม้จะไม่เก็บในตาราง แต่เป็นการรับและพิมพ์ข้อมูลเจ้าหน้าที่ห้ามเก็บในบริบทนี้ |  |
| F-004 | เดา Q-xx | backend/app/booking/service.py: next_queue_no | FR-BKG-04, Q-02 | โค้ดใช้รูปแบบ A001 เริ่มนับใหม่ทุกวัน แต่ spec ยังไม่ได้ตอบว่า queue_no รูปแบบและการรีเซ็ตเป็นอย่างไร จึงเป็นการตัดสินใจแทนทีม |  |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
| - | ไม่มีข้อค้นพบที่แก้แล้วในรอบนี้ | ได้จากการตรวจรอบนี้เท่านั้น |
