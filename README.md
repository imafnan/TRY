# Swapnopuri Properties and Developments

A full-stack real estate + certificate verification website built with Next.js 14.

## Tech Stack

- **Framework**: Next.js 14 App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **HTTP**: Axios
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.local` (already included) or set:

```
NEXT_PUBLIC_API_URL=https://client-certificate.onrender.com
NEXT_PUBLIC_PHONE=+88 01796278160
NEXT_PUBLIC_EMAIL=your@gmail.com
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage (public) |
| `/login` | Admin login |
| `/admin/dashboard` | Dashboard stats |
| `/admin/certificates` | Certificates list |
| `/admin/certificates/create` | Create new certificate |
| `/admin/certificates/[id]` | Edit certificate |

## Auth System

This API does NOT use JWT. After login:
- Email + password are saved in `localStorage`
- Sent as `x-admin-email` / `x-admin-password` headers on every admin request

## API Base URL

```
https://client-certificate.onrender.com
```

## Project Structure

```
src/
├── app/                   # Next.js App Router pages
│   ├── admin/             # Protected admin pages
│   ├── login/             # Login page
│   └── page.tsx           # Homepage
├── components/
│   ├── layout/            # Navbar, Footer, TopBar
│   └── certificate/       # Certificate form & print preview
├── sections/              # Homepage sections
├── services/              # API service layer (Axios)
├── hooks/                 # Custom React hooks
├── store/                 # Auth context/store
├── providers/             # React Query + Auth providers
├── types/                 # TypeScript interfaces
├── constants/             # App constants
└── utils/                 # Utility functions
```

## Build for Production

```bash
npm run build
npm start
```
