SELECT d.id, d.name
FROM doctors d
WHERE NOT EXISTS (
    SELECT 1
    FROM appointments a
    WHERE a.doctor_id = d.id
      AND a.status = 'confirmed'
      AND a.appointment_date = '2026-03-19'
      AND a.start_time < '11:00:00'
      AND a.end_time > '10:00:00'
)
AND NOT EXISTS (
    SELECT 1
    FROM doctor_shifts ds
    WHERE ds.doctor_id = d.id
      AND ds.shift_date = '2026-03-19'
      AND ds.shift_type = 'break'
      AND ds.start_time < '11:00:00'
      AND ds.end_time > '10:00:00'
);