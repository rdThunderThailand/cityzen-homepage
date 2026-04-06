

## แผนเพิ่มการเลือกพื้นที่ระดับ อำเภอ/เขต และ ตำบล/แขวง ในส่วนหัว

### สิ่งที่จะเปลี่ยน

ปัจจุบันส่วนหัวมีแค่ dropdown เลือกจังหวัด จะเพิ่มให้เลือกลึกลงได้อีก 2 ระดับ คือ **อำเภอ/เขต** และ **ตำบล/แขวง** โดยข้อมูลจะโหลดแบบ cascading (เลือกจังหวัด → โหลดอำเภอ → เลือกอำเภอ → โหลดตำบล)

### รายละเอียดทางเทคนิค

**1. ขยาย ProvinceContext ให้รองรับ district/subdistrict**

เพิ่ม state และ setter สำหรับ `selectedDistrict` และ `selectedSubdistrict` เข้าไปใน context เพื่อให้ทุกหน้าเข้าถึงค่าที่เลือกได้ เมื่อเปลี่ยนจังหวัดจะ reset อำเภอ/ตำบล และเมื่อเปลี่ยนอำเภอจะ reset ตำบล

**2. อัปเดต PublicHeader.tsx**

เพิ่ม Select dropdown อีก 2 ตัวต่อจากจังหวัด:
- **อำเภอ/เขต**: ใช้ `useDistricts(selectedProvince?.id)` จาก `useLocationData.ts` ที่มีอยู่แล้ว
- **ตำบล/แขวง**: ใช้ `useSubdistricts(selectedDistrict?.id)` จาก `useLocationData.ts`

แต่ละตัวจะ disabled จนกว่าจะเลือกระดับก่อนหน้า บน mobile จะแสดงเป็น compact layout (อาจใช้ Popover แทน inline selects)

**3. ไฟล์ที่แก้ไข**
- `src/contexts/ProvinceContext.tsx` — เพิ่ม district/subdistrict state
- `src/components/layout/PublicHeader.tsx` — เพิ่ม 2 dropdown ใหม่
- Rename context เป็น `LocationContext` (optional, สามารถคงชื่อเดิมได้)

