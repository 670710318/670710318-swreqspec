# test ของ T-03: จองคิวสำเร็จ
# AC-BKG-01 (FR-BKG-04)
from tests.conftest import AUTH


def test_AC_BKG_01(client, make_slot):
    """AC-BKG-01: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง จองแล้วต้องสำเร็จ"""
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201


def test_TC_BKG_01_1_success(client, db, make_slot):
    """Given ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
    When ยืนยันการจอง
    Then บันทึกสำเร็จ และที่นั่งว่างของช่วงนั้นเป็น 0
    Then แสดงหมายเลขคิว (รอ Q-02) - ยังไม่ตรวจเพราะรอ Q-02
    """
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201
    assert "booking_id" in res.json()
    db.refresh(slot)
    assert slot.remaining == 0


def test_TC_BKG_01_2_boundary_remaining_zero(client, db, make_slot):
    """Given ช่วง 09.00 น. มีที่นั่งคงเหลือ 1 ที่ (ขอบก่อนลดเป็น 0)
    When ยืนยันการจอง
    Then บันทึกสำเร็จ และที่นั่งว่างของช่วงนั้นเป็น 0
    Then แสดงหมายเลขคิว (รอ Q-02) - ยังไม่ตรวจเพราะรอ Q-02
    """
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201
    db.refresh(slot)
    assert slot.remaining == 0


def test_TC_BKG_01_3_unverified_user(client):
    """Given ยังไม่ได้ยืนยันตัวตน
    When พยายามยืนยันการจอง
    Then ระบบปฏิเสธการจองและไม่บันทึกรายการจอง
    """
    res = client.post("/bookings", json={"slot_id": 999}, headers={})

    assert res.status_code == 401
