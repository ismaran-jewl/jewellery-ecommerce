
```md
# 💍 Jewellery E-Commerce Website

A modern, scalable **Jewellery E-Commerce web application** built with **Next.js App Router**, **Tailwind CSS**, and **shadcn/ui**, following a strict and clean project architecture.

🌐 **Live Website**  
👉 https://jewellery-ecommerce-iota.vercel.app/

---

## 🚀 Tech Stack

- **Next.js (App Router)**
- **React**
- **Tailwind CSS** (configured in `globals.css`)
- **shadcn/ui** (official components only)
- **Yarn** (package manager)

---

## 📁 Project Structure Rules

This project follows **strict structural constraints** for maintainability and scalability.

### ❌ Do NOT Touch
- `.next`
- `.yarn`
- `node_modules`
- `globals.css`
- `lib` folder

### ✅ Allowed & Used
- `src/app/` → routing & pages
- `src/app/buy/page.js` → Buy page
- `src/components/` → reusable components only  
  - `src/components/ui/` → official shadcn/ui components
- `public/` → static assets (images, icons, etc.)

No configuration files were modified.

---

## 🛒 Buy Page

📍 **Route:** `/buy`  
📍 **Local URL:** `http://localhost:3000/buy`

The Buy Page is designed specifically for **selling jewellery** and includes:

- Elegant, premium UI
- Responsive layout
- Dummy JSON data defined **inside the same file**
- Tailwind-only styling (no extra CSS)
- App Router–compatible default export

📄 File location:
```

src/app/buy/page.js

````

---

## 🧩 Implementation Notes

- Implemented as a **single file**
- Dummy JSON data declared at the **top of the file**
- Ready for API integration
- Reusable components live in `src/components/`

---

## ▶️ Running the Project Locally

1. Install dependencies:
   ```bash
   yarn
````

2. Start development server:

   ```bash
   yarn dev
   ```

3. Open in browser:

   ```
   http://localhost:3000
   ```

---

## ✅ Mandatory Before Commit

⚠️ **IMPORTANT**

Before committing any code, you **must** run:

```bash
yarn build
```

This ensures:

* App Router compatibility
* No invalid exports
* Successful production build

Commits without a successful build are **not allowed**.

---

## 🎨 Design Philosophy

* Luxury jewellery brand aesthetics
* Minimal and elegant UI
* Conversion-focused layout
* Scalable architecture

---

## 🔮 Future Enhancements

* Backend & database integration
* Product filters (Gold / Diamond / Price range)
* Seller onboarding & valuation
* Checkout & payment gateway
* Admin dashboard

---

## 📌 Notes

* Static assets belong in `/public`
* No external image configuration required
* Fully compatible with Vercel deployment

---