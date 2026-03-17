# MySQL Backup/Restore สำหรับ Production

ใช้เอกสารนี้เมื่อรันระบบบน Ubuntu หรือเครื่องจริงที่ใช้ Docker Compose

## หลักที่ต้องยึด

1. production ต้องมี `DB_HOST`, `DB_USER`, `DB_NAME` และ `REQUIRE_DB=true`
2. ถ้า MySQL ใช้ไม่ได้ แอปจะไม่ fallback ไป file storage แล้ว
3. อัปเดตเว็บด้วย `docker compose up -d --build` ได้โดยข้อมูลไม่หาย ตราบใดที่ไม่ลบ volume
4. ห้ามใช้ `docker compose down -v` ถ้าไม่ตั้งใจลบฐานข้อมูล

## ไฟล์ `.env` ขั้นต่ำ

```env
DB_HOST=mysql
DB_PORT=3306
DB_USER=weblab
DB_PASS=weblab_pass
DB_NAME=weblab_f11
REQUIRE_DB=true
MYSQL_ROOT_PASSWORD=rootpass
```

## สำรองข้อมูล

Linux / Ubuntu:

```bash
bash ./scripts/backup-db.sh
```

สิ่งที่ script ทำ:

1. dump ฐานข้อมูลจาก service `mysql`
2. บีบอัดเป็น `.sql.gz`
3. สำรองโฟลเดอร์รูปจริง `data/uploads/` เป็น `uploads_YYYYMMDD_HHMMSS.tar.gz`
4. เก็บไว้ในโฟลเดอร์ `backups/`
5. ลบไฟล์ backup ที่เก่ากว่า 30 วันอัตโนมัติ

ปรับค่าได้:

```bash
KEEP_DAYS=60 OUTPUT_GZIP=true bash ./scripts/backup-db.sh
```

## กู้คืนข้อมูล

```bash
bash ./scripts/restore-db.sh ./backups/mysql_weblab_f11_YYYYMMDD_HHMMSS.sql.gz
```

หรือถ้าเป็น `.sql`

```bash
bash ./scripts/restore-db.sh ./backups/mysql_weblab_f11_YYYYMMDD_HHMMSS.sql
```

ถ้ามีไฟล์ `uploads_YYYYMMDD_HHMMSS.tar.gz` คู่กันในโฟลเดอร์เดียวกัน script จะกู้รูปกลับให้อัตโนมัติ

## อัปเดตเว็บแบบข้อมูลไม่หาย

```bash
cd ~/Web_F11
git pull origin main
bash ./scripts/backup-db.sh
docker compose up -d --build
```

## ตรวจหลังอัปเดต

```bash
docker compose ps
curl http://localhost:3000/health
```

กรณีปกติควรได้:

```json
{"ok":true,"dbEnabled":true,"dbConnected":true}
```
