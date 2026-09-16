# แผนเทคนิค: จองคิวตรวจสุขภาพ (Booking)

## 1. สรุปแนวทาง
- ฟีเจอร์นี้ให้ผู้รับบริการที่ยืนยันตัวตนแล้วเลือกแพ็กเกจ วัน และช่วงเวลา เพื่อจองคิวตรวจสุขภาพ และได้รับหมายเลขคิวในวันเดียวกัน
- ผู้ใช้จะเข้าถึงหน้าจองผ่านระบบผู้รับบริการที่มี precondition ของ IF-IDP-01 แล้วเลือกวันและเวลาโดยอาศัยข้อมูลที่ว่างจากระบบจัดคิวและข้อมูลแพ็กเกจ
- ระบบจะป้องกันการจองซ้ำในวันเดียวกันตาม FR-BKG-02 และแสดงตัวเลือก alternative เมื่อช่วงเวลาที่เลือกเต็มตาม FR-BKG-03
- เมื่อยืนยันสำเร็จ ระบบจะบันทึกการจอง ส่งข้อความยืนยันแบบ asynchronous และไม่ให้การส่งข้อความหยุดการยืนยันสำเร็จตาม FR-BKG-04 และ FR-BKG-05
- ในแผนนี้จะมุ่งไปที่ฟังก์ชัน core ของ UC-01 โดยไม่สร้างฟีเจอร์ยกเลิก/เลื่อนคิวหรือการจัดการโควตาแยกจาก UC-09 ตาม Scope

## 2. เทคโนโลยีที่ใช้

| สิ่งที่เลือก | มาจาก | หมายเหตุ |
|---|---|---|
| Frontend: React + Vite | ทีมเลือกเอง ไม่ได้มาจาก spec | ใช้สำหรับหน้าเลือกแพ็กเกจ/วัน/ช่วงเวลาและแสดงสถานะการจอง |
| Backend: Python FastAPI | ทีมเลือกเอง ไม่ได้มาจาก spec | ให้ API สำหรับตรวจความพร้อมของช่วงเวลาและบันทึกการจอง |
| Database: MySQL | CON-TECH-01 | ใช้เก็บข้อมูลการจอง ข้อมูลช่วงเวลา และ audit log |
| Transport security: TLS 1.2+ | NFR-SEC-01 | ใช้ทุกการรับส่งข้อมูลที่เกี่ยวกับการจองและข้อความยืนยัน |
| Notification channel: SMS/LINE async | IF-NOT-01 | ส่งยืนยันแบบไม่ block request การจอง |
| Audit log retention: 1 ปี | DOM-PDPA-01 | บันทึกผู้เข้าถึง เวลา และ HN ใน log ทุกครั้ง |

## 3. โมเดลข้อมูล

| Entity | ฟิลด์หลัก | รองรับ ID ใน spec |
|---|---|---|
| ServicePackage | package_id, name, valid_from, valid_to | FR-BKG-01, FR-BKG-06 |
| SlotAvailability | slot_date, time_slot, package_id, capacity_total, capacity_remaining, status | FR-BKG-01, FR-BKG-03, FR-BKG-06 |
| Booking | booking_id, hn, package_id, slot_date, time_slot, queue_number, status, created_at | FR-BKG-02, FR-BKG-04, FR-BKG-05 |
| BookingAttempt | attempt_id, booking_id, user_id, selected_slot, attempted_at, result | FR-BKG-03, FR-BKG-04 |
| NotificationMessage | message_id, booking_id, channel, payload, status, retry_count, next_retry_at | FR-BKG-05, NFR-REL-02 |
| AuditLog | audit_id, actor_id, accessed_hn, accessed_at, action, resource | DOM-PDPA-01 |

หมายเหตุ:
- ไม่เก็บเลขบัตรประชาชนในตารางการจอง ตาม IF-HIS-01
- HN จะใช้เป็นรหัสอ้างอิงภายในระบบแทนเลขบัตรประชาชน ตาม IF-HIS-01
- Precondition ของการยืนยันตัวตนต้องผ่านก่อนเข้าถึงข้อมูลผู้รับบริการตาม IF-IDP-01

## 4. API / หน้าจอ

### หน้าจอ
- Booking page: เลือกแพ็กเกจ วัน และช่วงเวลา พร้อมจำนวนที่นั่งคงเหลือ
  - รองรับ: FR-BKG-01, FR-BKG-06
- Booking confirmation modal: ยืนยันการจองและแสดงหมายเลขคิว
  - รองรับ: FR-BKG-04
- Warning/alternative slot panel: แจ้งช่วงเวลาเต็มและแสดง 3 ตัวเลือกใกล้เคียงภายในวันเดียวกันเท่านั้น
  - รองรับ: FR-BKG-03
- Booking result page: แสดงหมายเลขคิว และสถานะการส่งข้อความยืนยัน
  - รองรับ: FR-BKG-04, FR-BKG-05

### API
- GET /api/slots?dateFrom=...&dateTo=...&packageId=...
  - Input: ช่วงวันที่, แพ็กเกจ
  - Output: รายการช่วงเวลา ว่างคงเหลือ และ status
  - รองรับ: FR-BKG-01, FR-BKG-06
- GET /api/bookings/check-duplicate?hn=...&date=...
  - Input: HN และวันที่ต้องการจอง
  - Output: คิวที่ยังไม่ได้ใช้ในวันเดียวกัน
  - รองรับ: FR-BKG-02
- POST /api/bookings/validate
  - Input: HN, package_id, slot_date, time_slot
  - Output: success / slot_full / duplicate_active / alternative_slots
  - รองรับ: FR-BKG-02, FR-BKG-03
- POST /api/bookings
  - Input: HN, package_id, slot_date, time_slot
  - Output: booking_id, queue_number, notification_status
  - รองรับ: FR-BKG-04
- POST /api/notifications/retry
  - Input: message_id
  - Output: retry result
  - รองรับ: FR-BKG-05, NFR-REL-02

## 5. ตารางตรวจ Constraints

| Constraint ID | ถูกนำไปใช้ที่ไหนใน plan | สถานะ |
|---|---|---|
| CON-TECH-01 | Database MySQL และโครงสร้างข้อมูลสำหรับการจอง | ใช้แล้ว |
| DOM-PDPA-01 | Entity AuditLog และนโยบายเก็บ 1 ปี | ใช้แล้ว |
| IF-IDP-01 | Precondition validation ก่อนเข้าถึงข้อมูลผู้รับบริการและหน้า Booking | ใช้แล้ว |
| IF-HIS-01 | ใช้ HN เป็นรหัสอ้างอิงภายในระบบ และไม่เก็บเลขบัตรประชาชนใน Booking | ใช้แล้ว |
| IF-NOT-01 | NotificationMessage ใช้ SMS/LINE แบบ async และไม่ block flow หลัก | ใช้แล้ว |

## 6. แผนทดสอบจาก Acceptance Criteria

| AC ID | ชื่อ test | ทดสอบอย่างไร |
|---|---|---|
| AC-BKG-01 | test_AC_BKG_01_booking_success | ตั้งค่า slot 09.00 มีที่ว่าง 1 ที่ แล้วยืนยันจอง ตรวจว่า booking ถูกบันทึก และ remaining = 0 |
| AC-BKG-02 | test_AC_BKG_02_duplicate_booking_blocked | ให้ HN ที่มีคิวยังไม่ใช้ในวันเดียวกัน ทดสอบการจองใหม่ในวันเดียวกัน ต้องปฏิเสธและแสดงหมายเลขคิวเดิม |
| AC-BKG-03 | test_AC_BKG_03_slot_full_recommend_alternatives | ตั้ง slot เต็มก่อนยืนยัน แล้วทดสอบว่าเจอ alert “ช่วงเวลาเต็ม” และ 3 ตัวเลือกใกล้เคียง โดยไม่มีรายการซ้อน |
| AC-BKG-04 | test_AC_BKG_04_notification_retry_on_failure | จำลอง gateway error หรือ timeout แล้วยืนยันจอง ตรวจว่าการจองยังถูกบันทึกและมี retry queue ภายใน 5 นาที ไม่เกิน 3 ครั้ง |
| AC-BKG-05 | test_AC_BKG_05_slot_lookup_p95_under_2s | จำลองผู้ใช้ 200 คนเรียกข้อมูลช่วงเวลา ตรวจ p95 ของเวลาตอบสนอง <= 2 วินาที |
| AC-BKG-06 | test_AC_BKG_06_audit_log_written | จำลองการเปิดดูข้อมูลการจอง ตรวจว่า AuditLog มี actor, timestamp, HN อย่างครบถ้วน |

## 7. ลำดับงาน

1. สร้าง schema ฐานข้อมูลสำหรับ ServicePackage, SlotAvailability, Booking, NotificationMessage, AuditLog  - รองรับ: FR-BKG-01, FR-BKG-04, DOM-PDPA-01
2. สร้าง API ตรวจช่วงเวลาว่างและคำนวณจำนวนที่นั่งคงเหลือ - รองรับ: FR-BKG-01, FR-BKG-06
3. สร้างฟังก์ชันตรวจจองซ้ำและ validation ของซ้อนรายการในวันเดียวกัน - รองรับ: FR-BKG-02
4. สร้างความสามารถแสดง alert เมื่อ slot เต็ม และแสดง 3 ตัวเลือกใกล้เคียง - รองรับ: FR-BKG-03
5. สร้าง flow ยืนยันการจองและบันทึก booking พร้อมออก queue number - รองรับ: FR-BKG-04, AC-BKG-01
6. สร้าง queue สำหรับส่งข้อความยืนยันแบบ async และ retry เมื่อ error/timeout - รองรับ: FR-BKG-05, NFR-REL-02, AC-BKG-04
7. เพิ่ม audit log ในทุกการเข้าถึงข้อมูลผู้รับบริการ - รองรับ: DOM-PDPA-01, AC-BKG-06
8. ทดสอบครบตาม AC-BKG-01 ถึง AC-BKG-06 และตรวจความปลอดภัย/ปริมาณข้อมูล - รองรับ: ทุก AC

## 8. สิ่งที่ยังไม่ทำ

- Q-01 ยกเลิกแล้ว: ทีมตัดสินใจให้ "ช่วงเวลาใกล้เคียง" คำนึงถึงวันเดียวกันเท่านั้น ไม่รวมวันถัดไป

## สรุปทีม
- ข้อสรุปที่ชัดเจนแล้วคือ "ช่วงเวลาใกล้เคียง" จะคำนึงถึงเฉพาะวันเดียวกันเท่านั้น ไม่รวมวันถัดไป
- ส่วนที่ยังไม่ได้เดา คือค่าที่แน่นอนของ “ยกเลิก/เลื่อนคิว” และการจัดการโควตา เพราะอยู่ใน Out of scope และ UC-09 ตาม spec
