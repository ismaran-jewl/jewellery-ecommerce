# 💍 Jewellery E-Commerce — Architecture Guide

> A modern, scalable jewellery e-commerce platform built with **Next.js App Router**, **MongoDB**, **Tailwind CSS**, and **shadcn/ui**.

🌐 **Live:** [jewellery-ecommerce-iota.vercel.app](https://jewellery-ecommerce-iota.vercel.app/)

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | MongoDB (Mongoose) |
| Auth | NextAuth.js |
| Package Manager | Yarn |
| Deployment | Vercel |

---

## 📁 Project Structure

```
📦 src/
├── 📂 app/                        # Next.js App Router — all routes live here
│   ├── 📂 (admin)/                # Route group: admin panel
│   │   ├── admin/
│   │   │   ├── message/page.jsx   # Admin message view
│   │   │   ├── AdminClient.jsx    # Admin client component
│   │   │   └── page.jsx           # Admin dashboard
│   │   └── orders/                # Admin order management
│   │
│   ├── 📂 (login)/                # Route group: authentication
│   │   ├── forgot-password/
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.js
│   │
│   ├── 📂 (policy)/               # Route group: static/info pages
│   │   ├── about/
│   │   ├── contact/
│   │   ├── faq/
│   │   ├── offers/
│   │   ├── privacy-policy/
│   │   ├── search/
│   │   ├── terms/
│   │   └── layout.js
│   │
│   ├── 📂 (product)/              # Route group: product browsing
│   │   ├── category/[category]/[subcategory]/
│   │   ├── gallery/
│   │   ├── product/[id]/
│   │   ├── shop/
│   │   └── layout.js
│   │
│   ├── 📂 (sell)/                 # Route group: purchase flow
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── order-confirmation/
│   │   └── layout.js
│   │
│   ├── 📂 (user)/                 # Route group: user dashboard
│   │   ├── addresses/
│   │   ├── dashboard/
│   │   ├── gift-cards/
│   │   ├── orders/
│   │   ├── profile/
│   │   ├── qr-code/
│   │   ├── reviews/
│   │   ├── settings/
│   │   ├── wishlist/
│   │   └── layout.js
│   │
│   ├── 📂 api/                    # API Route handlers
│   │   ├── account/
│   │   ├── admin/          (message, orders, products)
│   │   ├── auth/           ([...nextauth], register)
│   │   ├── cart/
│   │   ├── message/[id]/
│   │   ├── orders/         ([id], root)
│   │   ├── products/       ([id], root)
│   │   ├── qr-code/
│   │   ├── register/
│   │   ├── upload/
│   │   ├── user/
│   │   └── wishlist/
│   │
│   ├── public-message/            # Public-facing message page
│   ├── layout.js                  # Root layout
│   ├── page.jsx                   # Home page
│   ├── not-found.jsx
│   └── globals.css                # ⛔ Do not modify
│
├── 📂 components/                 # Reusable UI components
│   ├── cart/
│   │   └── PersonalizedMessageButton.jsx
│   ├── layout/
│   │   ├── home/           (Navbar, Footer, HeroSection, FeaturedProducts…)
│   │   ├── product/        (Sidebar)
│   │   └── user/           (Sidebar)
│   ├── product/
│   │   └── ProductFilters.jsx
│   ├── providers/
│   │   └── auth-provider.jsx
│   └── ui/                        # shadcn/ui — official components only
│       └── (avatar, badge, button, card, dialog, input…)
│
├── 📂 features/                   # Feature-scoped custom hooks
│   ├── cart/useCart.js
│   ├── checkout/useCheckout.js
│   ├── filters/useFilters.js
│   ├── order/useOrder.js
│   ├── product/useProduct.js
│   ├── reviews/useReviews.js
│   ├── search/useSearch.js
│   ├── user/useUser.js
│   └── wishlist/useWishlist.js
│
├── 📂 hooks/                      # Shared/global hooks
│   ├── useCart.js
│   ├── useUser.js
│   └── useWishlist.js
│
├── 📂 lib/                        # ⛔ Do not modify
│   ├── auth.js                    # NextAuth config
│   ├── fetcher.js                 # SWR/fetch helper
│   ├── mongodb.js                 # DB connection
│   └── utils.js                  # Utility functions
│
├── 📂 models/                     # Mongoose data models
│   ├── Cart.js
│   ├── Message.js
│   ├── Order.js
│   ├── Product.js
│   ├── User.js
│   └── Wishlist.js
│
├── 📂 services/                   # External service integrations
│   ├── api/
│   ├── auth/
│   └── payment/
│
├── 📂 config/                     # App-level configuration
├── 📂 constants/                  # Shared constants
├── 📂 contexts/                   # React context providers
├── 📂 middleware/                 # Next.js middleware
├── 📂 styles/                     # Additional global styles
├── 📂 types/                      # TypeScript / JSDoc types
├── 📂 utils/                      # Pure utility functions
└── 📜 proxy.js
```

---

## 🗂️ Route Groups Explained

Next.js **route groups** `(name)` organize routes without affecting the URL.

| Group | URL Prefix | Purpose |
|---|---|---|
| `(admin)` | `/admin` | Admin dashboard & management |
| `(login)` | `/login`, `/register` | Auth pages with shared layout |
| `(policy)` | `/about`, `/faq`, `/contact`… | Info & static pages |
| `(product)` | `/shop`, `/product`, `/category` | Product discovery |
| `(sell)` | `/cart`, `/checkout` | Purchase funnel |
| `(user)` | `/dashboard`, `/orders`… | Logged-in user area |

---

## 🗄️ Data Models

All Mongoose models live in `src/models/`.

| Model | Description |
|---|---|
| `User.js` | Registered users, auth info, roles |
| `Product.js` | Jewellery products, variants, pricing |
| `Order.js` | Purchase records, status tracking |
| `Cart.js` | Per-user cart state |
| `Wishlist.js` | Saved products per user |
| `Message.js` | Personalized gift messages |

---

## 🔌 API Routes

All API handlers are in `src/app/api/`.

| Endpoint | Method(s) | Purpose |
|---|---|---|
| `/api/products` | GET, POST | List / create products |
| `/api/products/[id]` | GET, PUT, DELETE | Single product CRUD |
| `/api/orders` | GET, POST | List / place orders |
| `/api/orders/[id]` | GET, PATCH | Order detail & update |
| `/api/cart` | GET, POST, DELETE | Cart management |
| `/api/wishlist` | GET, POST, DELETE | Wishlist management |
| `/api/auth/[...nextauth]` | — | NextAuth handler |
| `/api/register` | POST | New user registration |
| `/api/upload` | POST | Image / asset upload |
| `/api/qr-code` | GET | QR code generation |
| `/api/message/[id]` | GET, POST | Gift messages |
| `/api/admin/products` | GET, POST, PUT | Admin product management |
| `/api/admin/orders` | GET, PATCH | Admin order management |
| `/api/admin/message` | GET | Admin message inbox |
| `/api/account` | GET, PUT | User account settings |

---

## ⚙️ Feature Hooks Architecture

Business logic is decoupled from UI via custom hooks in `src/features/`.

```
UI Component
     │
     ▼
features/cart/useCart.js     ←── feature-scoped hook (SWR + mutations)
     │
     ▼
lib/fetcher.js               ←── shared fetch utility
     │
     ▼
/api/cart                    ←── Next.js API route
     │
     ▼
models/Cart.js               ←── Mongoose model
     │
     ▼
MongoDB Atlas
```

---

## 🚦 Rules & Constraints

### ⛔ Never Touch
- `.next/` — build output
- `.yarn/` — package manager internals
- `node_modules/` — dependencies
- `src/app/globals.css` — global styles
- `src/lib/` — core utilities (auth, db, fetcher)

### ✅ Safe to Modify
- `src/app/**/page.jsx` — page components
- `src/components/` — reusable UI (not `ui/`)
- `src/features/` — business logic hooks
- `src/models/` — database schemas
- `src/app/api/` — API route handlers
- `public/` — static assets

### 🧩 Component Rules
- `src/components/ui/` → **shadcn/ui components only** — do not add custom files here
- All custom reusable components go in `src/components/cart/`, `layout/`, `product/`, etc.
- Pages should be thin — delegate logic to `features/` hooks

---

## ▶️ Running Locally

```bash
# Install dependencies
yarn

# Start dev server
yarn dev

# Open in browser
http://localhost:3000
```

---

## ✅ Before Every Commit

> ⚠️ **Mandatory** — no exceptions.

```bash
yarn build
```

A successful build confirms:
- No broken imports or exports
- App Router compatibility
- No missing environment variables
- Production-safe code

---

## 🎨 Design Philosophy

- **Luxury-first aesthetics** — minimal, elegant, premium feel
- **Conversion-focused** — every page drives toward a purchase
- **Mobile-responsive** — works across all screen sizes
- **Scalable architecture** — features are isolated and independently testable

---

## 🔮 Roadmap

- [ ] Payment gateway integration (Razorpay / Stripe)
- [ ] Advanced product filters (metal, gemstone, price)
- [ ] Seller onboarding & product valuation flow
- [ ] Review & rating system
- [ ] Email notifications (order updates)
- [ ] Full admin analytics dashboard
- [ ] PWA / mobile app

---

## 📌 Deployment Notes

- Hosted on **Vercel** — zero-config Next.js deployment
- Static assets served from `/public`
- Environment variables configured in Vercel dashboard
- MongoDB connection via `MONGODB_URI` env variable
- NextAuth secret configured via `NEXTAUTH_SECRET`