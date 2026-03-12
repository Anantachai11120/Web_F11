# คู่มือใช้งานแบบไม่ให้ข้อมูลหาย (สำหรับผู้เริ่มต้น)

เอกสารนี้ใช้กับโปรเจกต์นี้โดยตรง เพื่อให้ **อัปเดตเว็บแล้วข้อมูลไม่หาย**

## 1) หลักการสำคัญ

1. ข้อมูลจริงเก็บในฐานข้อมูล (MySQL) ไม่เก็บใน Git  
2. ฐานข้อมูลอยู่ใน Docker volume (`mysql_data`)  
3. ก่อนอัปเดตต้องสำรองข้อมูลเสมอ  
4. ห้ามใช้ `docker compose down -v` ถ้าไม่ตั้งใจล้างข้อมูล

## 2) เตรียมค่า `.env`

ตัวอย่างค่าที่ต้องมี:

```env
MYSQL_ROOT_PASSWORD=RootStrongPass123!
DB_HOST=mysql
DB_PORT=3306
DB_USER=weblab
DB_PASS=weblab_pass
DB_NAME=weblab_f11
```

> ค่า SMTP ใช้ค่าที่คุณใช้งานอยู่แล้ว

## 3) คำสั่งเริ่มระบบครั้งแรก

```powershell
cd D:\UI_webLabF11
docker compose up -d --build
docker compose ps
```

หน้าเว็บ:
- แอป: `http://localhost:3000`
- phpMyAdmin: `http://localhost:8080`

## 4) สำรองข้อมูล (Backup)

### Windows (PowerShell)

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\backup-db.ps1
```

ไฟล์สำรองจะอยู่ที่โฟลเดอร์ `backups/`

### Ubuntu / Linux

```bash
bash ./scripts/backup-db.sh
```

## 5) อัปเดตเว็บแบบปลอดภัย (Safe Update)

### Windows (PowerShell)

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\safe-update.ps1
```

### Ubuntu / Linux

```bash
bash ./scripts/safe-update.sh
```

สคริปต์จะทำให้ครบ:
1. Backup DB
2. `git pull`
3. `docker compose down --remove-orphans`
4. `docker compose up -d --build`
5. Health check

## 6) กู้ข้อมูลจากไฟล์ Backup

### Windows (PowerShell)

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\restore-db.ps1 -File .\backups\mysql_weblab_f11_YYYYMMDD_HHMMSS.sql
```

### Ubuntu / Linux (ตัวอย่าง)

```bash
cat ./backups/mysql_weblab_f11_YYYYMMDD_HHMMSS.sql | docker exec -i weblab-mysql sh -lc "mysql -uweblab -pweblab_pass weblab_f11"
```

## 7) คำสั่งที่ห้ามพลาด

- ตรวจสถานะ:
```bash
docker compose ps
docker compose logs -f --tail=100
```

- ห้ามใช้ถ้าไม่ตั้งใจล้าง DB:
```bash
docker compose down -v
```

ถ้าใช้คำสั่งนี้ จะลบ volume และข้อมูลฐานข้อมูลหาย

