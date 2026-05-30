Table: drug_allergies

Field       | Type                                   | Constraint            | Description |
id          | INT                                    | PK                    | Allergy Record ID |
patient_id  | INT                                    | FK -> patients(id)    | Patient |
drug_id     | INT                                    | FK -> drugs(id)       | Allergic Drug |
severity    | ENUM('LOW','MEDIUM','HIGH','CRITICAL') | NOT NULL              | Allergy Severity |
reaction    | VARCHAR(255)                           | NULL                  | Allergy Reaction |
created_at  | DATETIME                               | NOT NULL              | Created Date |

Constraints:

PRIMARY KEY (id)

FOREIGN KEY (patient_id)
REFERENCES patients(id)

FOREIGN KEY (drug_id)
REFERENCES drugs(id)

UNIQUE(patient_id, drug_id)
///
Table: prescriptions

Field       | Type          | Constraint         | Description |
id          | INT           | PK                 | Prescription ID |
patient_id  | INT           | FK -> patients(id) | Patient |
doctor_id   | INT           | FK -> doctors(id)  | Doctor |
drug_id     | INT           | FK -> drugs(id)    | Drug |
dosage      | VARCHAR(100)  | NOT NULL           | Dosage |

Constraints:

IF EXISTS (
    SELECT 1
    FROM drug_allergies
    WHERE patient_id = NEW.patient_id
      AND drug_id = NEW.drug_id
)
THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Patient is allergic to this drug';
END IF;
///

Workflow

Doctor Prescribes Drug
↓
Check Allergy History
↓
Allergy Found?
-- No → Save Prescription
-- Yes → Show Critical Alert
↓
Senior Doctor Override
↓
Reason + Electronic Signature
↓
Audit Log
↓
Approve Prescription
///
Alert: แสดงหน้าจอแจ้งเตือน พร้อมข้อความระบุว่า "ผู้ป่วยแพ้ยานี้ อาจเป็นอันตรายถึงชีวิต"
สิทธิ์การ Override: เฉพาะ หมอดูแลของคนไข้ หรือ แพทย์อาวุโส เท่านั้นที่มีสิทธิ์ และต้องระบุเหตุผลพร้อมเซ็นชื่ออิเล็กทรอนิกส์ ระบบจะบันทึก Log ไว้ทุกครั้ง