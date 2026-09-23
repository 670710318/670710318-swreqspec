import React, { useEffect, useState } from "react";
import { getSlots } from "../api/client";

// รองรับ: FR-BKG-01, FR-BKG-06, NFR-USE-01
export default function SlotPicker({ dateFrom, packageCode, onSelect }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await getSlots({ dateFrom, packageCode });
        if (mounted) setSlots(data || []);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [dateFrom, packageCode]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Available Slots</h2>
      {slots.length === 0 && <div>No slots available</div>}
      <ul>
        {slots.map((s) => (
          <li key={s.id}>
            <strong>{s.slot_date} {s.start_time}</strong> - Remaining: {s.remaining}
            <button
              onClick={() => onSelect && onSelect(s)}
              disabled={s.remaining <= 0}
              aria-label={`select-${s.id}`}
            >
              Select
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
