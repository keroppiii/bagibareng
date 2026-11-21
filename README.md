# BagiBareng

**BagiBareng** adalah aplikasi web untuk mencatat pengeluaran bersama dan membagi tagihan (*split bill*) dalam sebuah grup, misalnya teman liburan, teman kos, atau keluarga. Buat grup, undang teman lewat kode, catat siapa yang membayar, lalu lihat siapa berutang berapa kepada siapa.

---

## Fitur

### Fitur utama

| Modul | Fitur | Deskripsi |
|---|---|---|
| Authentication | Register, Login, Logout | Membuat akun, masuk, dan mengakhiri sesi dengan JWT |
| Dashboard | Overview | Ringkasan jumlah grup, total pengeluaran, utang, dan piutang |
| Group Management | Create, View, Update, Delete | Mengelola grup pengeluaran |
| Member Management | Join via kode, View | Anggota bergabung lewat kode undangan unik (contoh `BB-K7M3QX`) |
| Expense Management | Create, View, Update, Delete | Mencatat dan mengelola pengeluaran grup |
| Bill Splitting | Split Calculation | Menghitung pembagian tagihan secara merata (Equal Split) atau Custom Split |
| Balance Summary | Member Balance | Melihat kewajiban dan piutang setiap anggota |

### Fitur pendukung

| Fitur | Deskripsi |
|---|---|
| Search | Mencari pengeluaran berdasarkan nama/deskripsi, dan grup berdasarkan nama |
| Pagination | Membagi daftar grup dan transaksi menjadi beberapa halaman |
| Dashboard Statistics | Total pengeluaran dan statistik sederhana |
| Data Ownership | Setiap pengguna hanya bisa mengakses data grup yang ia ikuti |
| DTO Validation | Memvalidasi seluruh input dari pengguna |
| Error Handling | Pesan kesalahan yang jelas dan seragam |

### Fitur tambahan

Penandaan status sudah/belum dibayar pada utang, dan saran pelunasan antar anggota.

---

## Tech Stack

| Bagian | Teknologi |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend | NestJS 12, TypeScript |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 7 |
| Autentikasi | JWT (`Authorization: Bearer <token>`), password di-hash dengan bcrypt |
| Validasi | `class-validator` + `class-transformer` (DTO) |
| Testing | Jest |

---

## Struktur Repositori

```
BagiBareng/
├── backend/                 # REST API (NestJS)
│   ├── prisma/
│   │   └── schema.prisma    # skema database
│   └── src/
│       ├── main.ts          # prefix /api, CORS, ValidationPipe
│       ├── config/          # validasi environment variables
│       ├── prisma/          # PrismaModule & PrismaService
│       ├── common/          # decorators, dto, filters, interceptors, utils
│       ├── auth/            # register, login, me, logout, JWT
│       ├── users/
│       ├── groups/          # grup, kode undangan, anggota
│       ├── expenses/        # pengeluaran dan perhitungan split
│       ├── balances/        # saldo antar anggota
│       └── dashboard/       # ringkasan dashboard
└── frontend/                # Antarmuka web (Next.js App Router)
    └── src/app/
        ├── page.tsx         # landing page
        ├── login/
        ├── register/
        └── (main)/
```

---

## Menjalankan Proyek

**Prasyarat:** Node.js ≥ 24.9, npm, dan database PostgreSQL (proyek ini memakai [Neon](https://neon.tech)).

### Backend

```bash
cd backend
npm install
cp .env.example .env        # isi DATABASE_URL dan JWT_SECRET
npx prisma migrate dev      # membuat tabel dan meng-generate Prisma Client
npm run start:dev
```

API berjalan di `http://localhost:3001/api` (cek dengan `GET /api/health`).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplikasi berjalan di `http://localhost:3000`.

### Environment Variables (`backend/.env`)

| Variabel | Wajib | Contoh | Keterangan |
|---|:---:|---|---|
| `DATABASE_URL` | ✅ | `postgresql://USER:PASSWORD@HOST/BagiBareng?sslmode=require` | Connection string PostgreSQL |
| `JWT_SECRET` | ✅ | string acak ≥ 16 karakter | Kunci penanda tangan token |
| `JWT_EXPIRES_IN` | | `1d` | Masa berlaku token |
| `PORT` | | `3001` | Port server |
| `FRONTEND_URL` | | `http://localhost:3000` | Origin yang diizinkan CORS |

---

## Ringkasan API

- **Base URL:** `http://localhost:3001/api`
- **Autentikasi:** semua endpoint butuh header `Authorization: Bearer <accessToken>`, kecuali `register`, `login`, dan `health`.
- **Respons sukses:** `{ "data": ... }`. Untuk list: `{ "data": [...], "meta": { "page", "limit", "total", "totalPages" } }`.
- **Respons error:** `{ "statusCode", "error", "message": ["..."], "path", "timestamp" }`.

| Modul | Method | Endpoint | Keterangan |
|---|---|---|---|
| Auth | POST | `/auth/register` | Daftar akun |
| | POST | `/auth/login` | Masuk, mengembalikan `accessToken` |
| | GET | `/auth/me` | Data user yang sedang login |
| | POST | `/auth/logout` | Keluar |
| Dashboard | GET | `/dashboard/summary` | Kartu ringkasan, grup terbaru, aktivitas terbaru |
| Groups | POST | `/groups` | Buat grup (kode undangan dibuat otomatis) |
| | GET | `/groups?search=&page=&limit=` | Daftar grup milik saya |
| | GET | `/groups/:id` | Detail grup, anggota, total pengeluaran |
| | PATCH | `/groups/:id` | Ubah grup (OWNER) |
| | DELETE | `/groups/:id` | Hapus grup (OWNER) |
| | GET | `/groups/invite/:code` | Pratinjau grup dari kode undangan |
| | POST | `/groups/join` | Gabung grup dengan kode |
| | GET | `/groups/:id/members` | Daftar anggota |
| | DELETE | `/groups/:id/members/:userId` | Keluarkan anggota / keluar sendiri |
| Expenses | POST | `/expenses` | Catat pengeluaran |
| | GET | `/expenses` | List dengan search, filter, dan pagination |
| | GET | `/expenses/:id` | Detail pengeluaran beserta split |
| | PATCH | `/expenses/:id` | Ubah pengeluaran |
| | DELETE | `/expenses/:id` | Hapus pengeluaran |
| | POST | `/expenses/split-preview` | Pratinjau pembagian tanpa menyimpan |
| | PATCH | `/expenses/:id/splits/:userId/status` | Tandai split sudah/belum dibayar |
| Balances | GET | `/groups/:id/balances` | Saldo tiap anggota dan saran pelunasan |

Query `GET /expenses`: `groupId`, `search`, `category`, `dateFrom`, `dateTo`, `paidById`, `page`, `limit`, `sortBy`, `order`.

---

## Desain Database

```mermaid
erDiagram
  User ||--o{ Group : "owns"
  User ||--o{ GroupMember : "joins"
  Group ||--o{ GroupMember : "has"
  Group ||--o{ Expense : "contains"
  User ||--o{ Expense : "paid by"
  Expense ||--o{ ExpenseSplit : "split into"
  User ||--o{ ExpenseSplit : "owes"

  User {
    uuid id PK
    string name
    string email UK
    string passwordHash
  }
  Group {
    uuid id PK
    string name
    string emoji
    string inviteCode UK
    uuid ownerId FK
  }
  GroupMember {
    uuid id PK
    uuid groupId FK
    uuid userId FK
    enum role "OWNER | MEMBER"
  }
  Expense {
    uuid id PK
    uuid groupId FK
    uuid paidById FK
    string title
    enum category
    int amount
    datetime expenseDate
  }
  ExpenseSplit {
    uuid id PK
    uuid expenseId FK
    uuid userId FK
    int amountOwed
    boolean isPaid
  }
```

Kategori pengeluaran: `FOOD`, `TRANSPORT`, `GROCERIES`, `ACCOMMODATION`, `ENTERTAINMENT`, `BILLS`, `OTHER`. Skema lengkap ada di [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma).

---
