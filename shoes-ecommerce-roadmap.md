`# 👟 Shoes E-commerce Website — Next.js Roadmap

Pura project **12 phases** mein divide hai. Ek phase complete karo, check kar lo "Done when" criteria, phir next pe jao. Koi bhi phase skip mat karo — yeh sequence important hai.

---

## ✅ Phase 0 — Planning & Design (1-2 din)

**Goal:** Project ka blueprint ready ho jaye, taake coding shuru karte waqt confusion na ho.

**Tasks:**
- [ ] Decide karo: kitne products honge, kya categories honge (Running, Casual, Sports, Sneakers etc.)
- [ ] Decide karo: products data kahan se aayega — static JSON, CMS (Sanity), ya database (MongoDB/Supabase)
- [ ] Wireframe banao (Figma free hai, ya paper pe sketch bhi chalega) — Home, Shop, Product, Cart, Checkout
- [ ] Color palette + font decide karo (e.g. black/white/accent color, Poppins/Inter font)
- [ ] Reference websites dekho (Nike, Adidas, Puma ki site) — inspiration ke liye

**Done when:** Aapke pass ek rough sketch/Figma file ho jisme har page ka layout dikhe.

---

## ✅ Phase 1 — Project Setup (1 din)

**Goal:** Development environment ready ho.

**Tasks:**
- [ ] `npx create-next-app@latest` se project banao (TypeScript + App Router + Tailwind select karo)
- [ ] Git initialize karo, GitHub repo banao, initial commit push karo
- [ ] shadcn/ui install karo: `npx shadcn@latest init`
- [ ] Framer Motion install karo: `npm install motion`
- [ ] Zustand install karo: `npm install zustand`
- [ ] Folder structure banao:
  ```
  app/
    (main)/
      page.tsx          → home
      shop/page.tsx
      product/[slug]/page.tsx
      cart/page.tsx
      checkout/page.tsx
  components/
    ui/                 → shadcn components
    layout/             → navbar, footer
    product/            → product card, gallery
  lib/                  → utils, data fetching
  store/                → zustand stores
  types/                → TypeScript types
  ```
- [ ] ESLint + Prettier setup karo (consistent code style)

**Done when:** `npm run dev` chalane par blank Next.js app browser mein open ho jaye, aur folder structure ready ho.

---

## ✅ Phase 2 — Design System & Core Components (2 din)

**Goal:** Reusable building blocks ready hon jo har page mein use hongi.

**Tasks:**
- [ ] Navbar component (logo, links, cart icon with item count, search icon)
- [ ] Footer component
- [ ] Button, Card, Badge, Dialog/Modal — shadcn se add karo (`npx shadcn@latest add button card dialog badge`)
- [ ] Product Card component (image, name, price, hover effect)
- [ ] Loading skeleton components (shimmer effect)
- [ ] Mobile responsive Navbar (hamburger menu)

**Done when:** Aap koi bhi dummy page bana ke usme Navbar + Footer + Product Card test kar sakein.

---

## ✅ Phase 3 — Home Page (2-3 din)

**Goal:** Pehla impression wala page complete ho.

**Sections to build:**
- [x] Hero section (banner + heading + CTA button + animated shoe image)
- [x] Categories grid (Running, Casual, Sports, etc.)
- [x] Featured/New Arrivals carousel
- [x] Best sellers section
- [x] Testimonials slider
- [x] Newsletter signup section
- [x] Footer

**Done when:** Home page fully responsive ho (mobile + desktop) with dummy product data.

---

## Phase 4 — Shop & Product Pages (3-4 din)

**Goal:** Browsing aur product detail experience complete ho.

**Shop Page (`/shop`):**
- [ ] Sidebar filters (size, color, brand, price range slider)
- [ ] Sort dropdown (price, newest, popularity)
- [ ] Product grid with pagination/infinite scroll
- [ ] Mobile filter drawer

**Product Detail Page (`/product/[slug]`):**
- [ ] Image gallery with thumbnail switch + zoom
- [ ] Size selector
- [ ] Color variant selector
- [ ] Add to cart button
- [ ] Description + Reviews tabs
- [ ] Related products section

**Done when:** Dummy data se filter, sort, aur product detail sab kaam karein.

---

## ✅ Phase 5 — Cart & State Management (2-3 din)

**Goal:** Cart functional ho — add, remove, update quantity sab kaam kare.

**Tasks:**
- [ ] Zustand store banao cart ke liye (add, remove, updateQuantity, clearCart functions)
- [ ] Cart drawer (slide-in sidebar) ya full Cart page
- [ ] Cart icon mein live item count
- [ ] Price summary (subtotal, discount, total)
- [ ] Persist cart in localStorage (zustand persist middleware)
- [ ] Wishlist functionality (same pattern as cart)

**Done when:** Product add/remove karne par cart real-time update ho aur refresh karne par bhi data save rahe.

---

## ✅ Phase 6 — Backend / Database Setup (4-6 din)

**Goal:** Real product data backend se aaye, dummy data hat jaye.

**Option A (CMS route — easier):**
- [ ] Sanity.io account banao, schema banao (product, category)
- [ ] Sanity Studio se products add karo
- [ ] Next.js mein Sanity client connect karo, data fetch karo

**Option B (Custom backend):**
- [ ] Supabase/MongoDB setup karo
- [ ] Prisma schema banao (Product, Order, User tables)
- [ ] API routes ya Server Actions banao (`getProducts`, `getProductBySlug`)

**Tasks (dono options ke liye common):**
- [ ] Home, Shop, Product pages ko real data se connect karo
- [ ] Loading & error states handle karo

**Done when:** Saara product data database/CMS se aa raha ho, dummy JSON hata diya gaya ho.

---

## ✅ Phase 7 — Authentication (2-3 din)

**Goal:** User login/signup kaam kare.

**Tasks:**
- [ ] Clerk ya NextAuth (Auth.js) install karo
- [ ] Login page (`/login`)
- [ ] Signup page (`/signup`)
- [ ] Protected routes (Account page sirf logged-in users ke liye)
- [ ] User session navbar mein show karo (profile icon/dropdown)

**Done when:** User signup/login/logout kar sake aur session persist ho.

---

## ✅ Phase 8 — Checkout & Payments (3-4 din)

**Goal:** Order place karne ka pura flow kaam kare.

**Tasks:**
- [ ] Checkout page — shipping form (React Hook Form + Zod validation)
- [ ] Multi-step checkout (Shipping → Payment → Review)
- [ ] Stripe integrate karo (ya JazzCash/Easypaisa agar Pakistan-specific)
- [ ] Order confirmation page (order ID, summary)
- [ ] Order data database mein save karo
- [ ] Order history Account page mein show karo

**Done when:** Test payment se ek complete order place ho jaye aur database mein save ho.

---

## ✅ Phase 9 — Animations & Premium Polish (2-3 din)

**Goal:** Site "premium" feel de.

**Tasks:**
- [ ] Hero section — fade-in + slide-up animations
- [ ] Product cards — hover scale + image crossfade
- [ ] Page transitions (Framer Motion `AnimatePresence`)
- [ ] Add-to-cart micro-animation (button ripple, cart icon bounce)
- [ ] Scroll-reveal animations (`whileInView`)
- [ ] Filter sidebar slide animation
- [ ] Skeleton loaders har jagah jahan data fetch ho raha ho
- [ ] Dark/Light mode toggle (optional but premium touch)

**Done when:** Site smooth feel kare, koi animation laggy ya distracting na ho.

---

## ✅ Phase 10 — SEO & Performance (1-2 din)

**Goal:** Site fast ho aur Google pe rank ho sake.

**Tasks:**
- [ ] Metadata add karo har page pe (title, description, OG tags)
- [ ] `sitemap.xml` aur `robots.txt` generate karo
- [ ] Image optimization (Next.js `<Image>` component use karo har jagah)
- [ ] Lighthouse score check karo (Performance, SEO, Accessibility)
- [ ] Lazy loading for below-fold sections

**Done when:** Lighthouse score 85+ ho aur har page ka proper title/description ho.

---

## ✅ Phase 11 — Testing & Bug Fixing (2 din)

**Goal:** Site har device pe sahi chale.

**Tasks:**
- [ ] Mobile, tablet, desktop pe test karo
- [ ] Cart, checkout, login flow end-to-end test karo
- [ ] Edge cases check karo (empty cart, no search results, invalid login)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)

**Done when:** Koi major bug na ho, sab flows smoothly kaam karein.

---

## ✅ Phase 12 — Deployment (1 din)

**Goal:** Site live ho jaye.

**Tasks:**
- [ ] Code GitHub pe push karo (final clean commit)
- [ ] Vercel account banao, GitHub repo import karo
- [ ] Environment variables Vercel dashboard mein set karo (database URL, Stripe keys, etc.)
- [ ] Deploy karo, live URL test karo
- [ ] Custom domain attach karo (agar hai)
- [ ] Production mein payment test karo (Stripe test mode se live mode switch karo)

**Done when:** Site live URL pe accessible ho aur sab features production mein kaam karein.

---

## 📌 Quick Reference — Tools Summary

| Category | Tool |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Animations | Framer Motion |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Backend | Sanity.io / Supabase + Prisma |
| Auth | Clerk / NextAuth |
| Payments | Stripe |
| Deployment | Vercel |

---

### 💡 Tip
Har phase complete hone ke baad Git commit karo (e.g. `git commit -m "Phase 3: Home page complete"`) — isse progress track karna easy ho jayega aur kabhi rollback bhi karna pade to ho sakega.
