# miu-card-visit

Trang link-in-bio cá nhân kiểu [phandonggiang.passio.eco](https://phandonggiang.passio.eco/).
Static-feel cho người xem, có `/admin` để chủ trang đăng nhập và chỉnh sửa nội dung.

- Stack: Next.js 14 (App Router) · TypeScript · Tailwind · Lucide
- Storage: file JSON (`data/profile.json`) — không cần database
- Auth admin: password đơn giản qua biến môi trường, JWT cookie 7 ngày
- Deploy: Docker Compose, GitHub Actions self-hosted runner (theo pattern [e-com](https://github.com/hai123321/e-com))

## Routes

- `/` — trang public, render từ `data/profile.json`
- `/admin/login` — form nhập mật khẩu
- `/admin` — editor (yêu cầu đăng nhập)
- `GET /api/profile` — public, đọc profile
- `PUT /api/profile` — yêu cầu cookie admin, ghi profile

`middleware.ts` chặn `/admin/*` (trừ `/admin/login`) và `PUT /api/profile` nếu cookie không hợp lệ.

## Phát triển local

```bash
cp .env.example .env.local
# Sửa ADMIN_PASSWORD và JWT_SECRET (>= 16 ký tự)
npm install
npm run dev
```

Mở http://localhost:3000 (public) và http://localhost:3000/admin (editor).

Lần đầu chạy, app tự tạo `data/profile.json` với nội dung mẫu.

## Build production

```bash
npm run build
npm start
```

## Deploy bằng Docker Compose

```bash
# Trên VPS, tạo external network 1 lần
docker network create proxy-net

# Tạo .env (cùng các secret)
cp .env.example .env

# Build + chạy
docker compose up -d --build
```

Volume `./data` được mount vào `/app/data` trong container — `profile.json` còn nguyên qua các lần deploy.

Container nằm trên network `proxy-net` để reverse proxy (nginx) cùng network có thể proxy tới `miu-card-visit:3000`. Xem mẫu cấu hình ở [`nginx/miu-card-visit.conf.example`](nginx/miu-card-visit.conf.example).

## CI/CD (GitHub Actions)

Workflow [`deploy.yml`](.github/workflows/deploy.yml) chạy trên `[self-hosted, miu-server]`, mỗi lần push vào `main`:

1. Checkout với `clean: false` để giữ thư mục `data/` cũ
2. Sinh `.env` từ secrets
3. `docker compose up -d --build`
4. Chờ healthcheck
5. `docker image prune -f`

### Secrets cần cấu hình ở GitHub repo

| Secret | Ví dụ | Ghi chú |
|---|---|---|
| `ADMIN_PASSWORD` | `your-strong-password` | Mật khẩu đăng nhập `/admin` |
| `JWT_SECRET` | `random-32+chars` | Random ≥ 32 ký tự |
| `NEXT_PUBLIC_SITE_URL` | `https://card.example.com` | URL công khai của trang |

Workflow [`build.yml`](.github/workflows/build.yml) chạy `npm run build` cho mọi PR / branch khác `main` để bảo vệ chất lượng.

## Cấu trúc

```
app/
  page.tsx              # public link-in-bio
  admin/page.tsx        # editor (server-rendered shell + client component)
  admin/login/          # login form (Suspense + client form)
  api/auth/login        # POST → set cookie
  api/auth/logout       # POST → clear cookie
  api/profile           # GET public · PUT admin-only
components/
  profile/              # ProfileCard, SocialIcon
  admin/                # AdminEditor
lib/
  profile.ts            # đọc/ghi data/profile.json (atomic write)
  auth.ts               # jose JWT, constant-time password check
  types.ts              # Profile / LinkItem / SocialItem
middleware.ts           # gate /admin và PUT /api/profile
data/
  profile.json          # auto-tạo lần đầu, persist qua volume
```

## Bảo mật ngắn gọn

- Mật khẩu so sánh constant-time, JWT ký bằng `JWT_SECRET`
- Cookie `httpOnly` + `secure` (production) + `sameSite=lax`
- Middleware chặn cả page admin và write API
- Build CI dùng placeholder secret để khỏi lộ secret thật
