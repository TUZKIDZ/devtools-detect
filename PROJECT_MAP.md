# PROJECT_MAP.md
# Rayan Travel Services LTD — Architecture Document
# Généré le : 2026-05-13 | Stack vérifiée sur npm registry | PLAN FINAL VALIDÉ

---

## [BRAND]

**Nom**       : Rayan Travel Services LTD
**Nom court** : Rayan Travel (navbar, mobile)

### Design Tokens

```css
/* Brand Gradient */
--brand-pink:      #E5007A;
--brand-purple:    #9333EA;
--brand-blue:      #4B9CE4;
--brand-gradient:  linear-gradient(135deg, #E5007A 0%, #9333EA 50%, #4B9CE4 100%);

/* Neutrals */
--bg-white:        #FFFFFF;
--bg-light:        #F8F9FF;
--text-dark:       #1A1A2E;
--text-muted:      #6B7280;
--border:          #E5E7EB;

/* UI States */
--success:         #10B981;
--warning:         #F59E0B;
--error:           #EF4444;
```

### Application des tokens

| Élément               | Valeur                                         |
|-----------------------|------------------------------------------------|
| Boutons primaires     | gradient `#E5007A → #9333EA → #4B9CE4`        |
| Tabs search actifs    | underline `#E5007A`                            |
| Prix & badges         | `#E5007A` bold                                 |
| Hero overlay          | image + gradient opacity 40%                   |
| Cards                 | white + border `#E5E7EB` + hover shadow rose   |
| Footer                | `#1A1A2E` + gradient sur les liens             |
| Navbar                | white sticky + logo SVG fourni                 |

---

## [TECH_STACK]

### Core

| Couche       | Technologie              | Version        | Rôle                                    |
|--------------|--------------------------|----------------|-----------------------------------------|
| Monorepo     | Turborepo                | latest         | Orchestration builds web + mobile       |
| Web          | Next.js                  | 16.2.6         | SSR, App Router, Server Actions         |
| Mobile       | React Native + Expo      | 0.79.x / SDK53 | iOS + Android (apps/mobile)             |
| Runtime      | React                    | 19.2.6         | Server + Client Components              |
| Language     | TypeScript               | 6.0.3          | Typage strict, partagé web + mobile     |
| Styles (web) | Tailwind CSS             | 4.3.0          | CSS-first, pas de config JS             |
| Composants   | shadcn/ui + Radix UI     | latest         | UI accessible (web)                     |
| Icônes       | lucide-react             | 1.14.0         | Web / lucide-react-native (mobile)      |

### Data & Auth

| Couche       | Technologie              | Version        | Rôle                                    |
|--------------|--------------------------|----------------|-----------------------------------------|
| ORM          | Prisma                   | 7.8.0          | Accès DB typé (packages/db)             |
| Base données | PostgreSQL               | 17.x           | Docker (VPS)                            |
| Cache        | Redis                    | 7.x            | Cache RateHawk responses (TTL)          |
| Cache client | ioredis                  | latest         | Client Redis Node.js                    |
| Auth         | next-auth                | 4.24.14        | Session, Google OAuth, credentials      |
| Auth adapter | @auth/prisma-adapter     | 2.11.2         | NextAuth ↔ Prisma                       |
| i18n         | next-intl                | latest         | EN + FR — switcher navbar               |

### APIs Externes

| Service      | Provider                 | Couverture                              |
|--------------|--------------------------|-----------------------------------------|
| Hôtels       | RateHawk Hotels API      | Search, detail, availability, booking   |
| Vols         | RateHawk Flights API     | Search, detail, availability, booking   |
| Tours        | RateHawk Activities API  | Search, detail, availability, booking   |
| Voitures     | RateHawk Cars API        | Search, detail, availability, booking   |
| Paiement     | Stripe                   | 22.1.1 — Payment Intent + webhooks     |

### Formulaires & State

| Couche       | Technologie              | Version        | Rôle                                    |
|--------------|--------------------------|----------------|-----------------------------------------|
| Validation   | Zod                      | 4.4.3          | Schemas partagés web + mobile           |
| Formulaires  | react-hook-form          | 7.75.0         | Web uniquement                          |
| State client | Zustand                  | 5.0.13         | Panier (localStorage web)               |
| Data fetch   | TanStack Query           | 5.100.10       | Cache côté client, refetch, pagination  |

### Infra VPS

| Couche       | Technologie              | Version        | Rôle                                    |
|--------------|--------------------------|----------------|-----------------------------------------|
| Proxy        | Nginx                    | 1.27-alpine    | Reverse proxy + SSL termination         |
| SSL          | Certbot / Let's Encrypt  | latest         | Certificats auto-renouvelés             |
| Containers   | Docker + Compose         | 27.x           | Orchestration services VPS              |
| CI/CD        | GitHub Actions           | —              | Build + SSH deploy sur merge main       |
| Process      | Docker restart policies  | —              | Remplacement PM2                        |

### Logging

| Couche       | Technologie              | Version        | Rôle                                    |
|--------------|--------------------------|----------------|-----------------------------------------|
| Logger       | Custom async queue       | —              | lib/logger.ts — non-bloquant, JSON prod |
| Niveaux      | info / warn / error      | —              | Pas de verbose, pas de trace            |

---

## [SYSTEM_FLOW]

```
┌─────────────────────────────────────────────────────────────────┐
│                        VISITEUR ANONYME                         │
└─────────────────────────────────────────────────────────────────┘

  / (Accueil)
  └─► HeroSearch [tabs: Hôtel | Vol | Tour | Voiture]
        └─► /search?type=hotel&destination=Paris&checkin=...
              │
              ├─► Redis Cache HIT → résultats immédiats
              │
              └─► Redis Cache MISS
                    └─► RateHawk API (hotels/flights/tours/cars)
                          └─► Redis.set(cacheKey, TTL:15min)
                                └─► Listing résultats + filtres

  ResultCard → /hotels/[slug]  |  /flights/[slug]
             → /tours/[slug]   |  /cars/[slug]
               └─► Galerie + Détails + Disponibilités + Prix
                     └─► "Réserver" → CartDrawer (Zustand)

  /cart
  └─► Résumé items + quantités + total
        └─► "Checkout" → si non-connecté → /auth/login → redirect

  /auth/login  |  /auth/register
  └─► Google OAuth  |  Email + Password (bcrypt)
        └─► Session NextAuth → redirect /checkout

  /checkout
  └─► CheckoutForm (infos passager + paiement)
        └─► Stripe Payment Intent
              └─► Confirmation client
                    └─► POST /api/webhooks/stripe
                          └─► Booking status → CONFIRMED
                                └─► /booking/[id]

┌─────────────────────────────────────────────────────────────────┐
│                      UTILISATEUR CONNECTÉ                        │
└─────────────────────────────────────────────────────────────────┘

  /account/bookings → Historique réservations + statuts

┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN                                    │
└─────────────────────────────────────────────────────────────────┘

  /admin  (middleware: role === ADMIN)
  ├─► /admin           → Dashboard (stats: bookings, revenus, users)
  ├─► /admin/listings  → CRUD hôtels/vols/tours/voitures (Server Actions)
  ├─► /admin/bookings  → Liste + changement statut
  └─► /admin/users     → Liste utilisateurs + rôles

┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION MOBILE                          │
└─────────────────────────────────────────────────────────────────┘

  Expo (iOS + Android)
  └─► Même API REST Next.js (/api/search, /api/bookings)
  └─► Packages partagés : @travel/types, @travel/ratehawk, @travel/db
  └─► Auth : OAuth Google (Expo AuthSession) + même endpoint NextAuth
```

---

## [ARCHITECTURE]

### Structure Monorepo

```
travel-platform/
├── apps/
│   ├── web/                          # Next.js 16 — priorité M1→M5
│   └── mobile/                       # React Native + Expo — M6
│
├── packages/
│   ├── db/                           # Prisma (partagé)
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── index.ts
│   │
│   ├── ratehawk/                     # SDK multi-API RateHawk (partagé)
│   │   ├── client.ts                 # HTTP base (retry x3, timeout 10s, auth)
│   │   ├── hotels.ts                 # search, detail, availability, book
│   │   ├── flights.ts                # search, detail, availability, book
│   │   ├── activities.ts             # tours/experiences
│   │   ├── cars.ts                   # voitures/transfers
│   │   ├── mapper.ts                 # RateHawk types → types internes
│   │   └── types.ts                  # types bruts RateHawk
│   │
│   ├── types/                        # Types TS partagés web + mobile
│   │   ├── booking.ts
│   │   ├── search.ts
│   │   ├── user.ts
│   │   └── index.ts
│   │
│   └── config/                       # Configs partagées
│       ├── eslint.js
│       ├── tsconfig.base.json
│       └── tailwind.base.ts          # (web uniquement mais centralisé)
│
├── docker/
│   ├── docker-compose.yml            # Dev local
│   ├── docker-compose.prod.yml       # VPS production
│   ├── Dockerfile.web
│   └── nginx.conf
│
├── .github/
│   └── workflows/
│       └── deploy.yml                # CI/CD → SSH VPS
│
├── turbo.json
├── package.json                      # pnpm workspaces
└── PROJECT_MAP.md                    # ce fichier
```

### Structure Web (`apps/web/`)

```
apps/web/
├── app/
│   ├── (public)/
│   │   └── page.tsx                  # Accueil + HeroSearch
│   ├── search/
│   │   └── page.tsx                  # Server Component — résultats
│   ├── hotels/[slug]/page.tsx
│   ├── flights/[slug]/page.tsx
│   ├── tours/[slug]/page.tsx
│   ├── cars/[slug]/page.tsx
│   ├── cart/page.tsx                 # Client Component (Zustand)
│   ├── checkout/page.tsx             # Protected
│   ├── booking/[id]/page.tsx         # Confirmation
│   ├── account/bookings/page.tsx     # Protected
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── admin/
│   │   ├── layout.tsx                # Guard: role ADMIN
│   │   ├── page.tsx                  # Dashboard stats
│   │   ├── listings/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── bookings/page.tsx
│   │   └── users/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── search/route.ts           # REST endpoint (web + mobile)
│       ├── bookings/route.ts         # REST endpoint (web + mobile)
│       └── webhooks/stripe/route.ts
│
├── components/
│   ├── ui/                           # shadcn/ui (généré — ne pas éditer)
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── AdminSidebar.tsx
│   ├── search/
│   │   ├── HeroSearch.tsx            # Tabs 4 types
│   │   ├── SearchFilters.tsx         # Prix, dates, rating
│   │   └── ResultCard.tsx            # Polymorphique (Hotel|Flight|Tour|Car)
│   └── booking/
│       ├── CartDrawer.tsx
│       ├── CheckoutForm.tsx
│       └── BookingSummary.tsx
│
├── lib/
│   ├── auth.ts                       # NextAuth config
│   ├── stripe.ts                     # Singleton Stripe
│   ├── redis.ts                      # Singleton ioredis
│   ├── cache.ts                      # get/set avec TTL — wrapper Redis
│   └── logger.ts                     # Async queue logger
│
├── modules/
│   ├── hotels/
│   │   ├── queries.ts                # DB + RateHawk calls
│   │   ├── actions.ts                # Server Actions (CRUD admin)
│   │   └── schemas.ts                # Zod
│   ├── flights/
│   │   ├── queries.ts
│   │   ├── actions.ts
│   │   └── schemas.ts
│   ├── tours/
│   │   ├── queries.ts
│   │   ├── actions.ts
│   │   └── schemas.ts
│   ├── cars/
│   │   ├── queries.ts
│   │   ├── actions.ts
│   │   └── schemas.ts
│   └── bookings/
│       ├── queries.ts
│       ├── actions.ts                # createBooking, cancelBooking
│       └── schemas.ts
│
├── store/
│   └── cart.ts                       # Zustand + localStorage persist
│
├── middleware.ts                      # Auth guard + admin protection
└── next.config.ts
```

### Schéma Prisma (`packages/db/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  password  String?   // null si OAuth uniquement
  role      Role      @default(USER)
  bookings  Booking[]
  accounts  Account[]
  sessions  Session[]
  createdAt DateTime  @default(now())
}

enum Role { USER ADMIN }

// NextAuth required models
model Account { /* standard NextAuth fields */ }
model Session { /* standard NextAuth fields */ }

model Listing {
  id            String      @id @default(cuid())
  slug          String      @unique
  type          ListingType
  name          String
  description   String
  location      String
  price         Decimal
  images        String[]
  ratehawkId    String?     // ID externe RateHawk
  available     Boolean     @default(true)
  metadata      Json        // champs spécifiques par type (stars, airline, etc.)
  bookings      Booking[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

enum ListingType { HOTEL FLIGHT TOUR CAR }

model Booking {
  id              String        @id @default(cuid())
  userId          String
  user            User          @relation(fields: [userId], references: [id])
  listingId       String
  listing         Listing       @relation(fields: [listingId], references: [id])
  status          BookingStatus @default(PENDING)
  totalPrice      Decimal
  stripePaymentId String?
  passengers      Int           @default(1)
  checkIn         DateTime?
  checkOut        DateTime?
  metadata        Json          // infos passagers, options
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

enum BookingStatus { PENDING CONFIRMED CANCELLED REFUNDED }
```

> **Note** : Le modèle `Listing` est unifié (1 table polymorphique via `type` + `metadata` JSON).
> Évite 4 tables quasi-identiques. Le champ `metadata` stocke les spécificités (étoiles hôtel, compagnie aérienne, etc.).

### Couche Cache RateHawk

```
Stratégie TTL par type :
  hotels       → 15 min  (prix changent fréquemment)
  flights      → 10 min  (très volatils)
  tours        → 30 min  (stables)
  cars         → 30 min  (stables)

Cache key format : rh:{type}:{hash(searchParams)}
Redis maxmemory  : 512mb (VPS)
Eviction policy  : allkeys-lru

En cas de RateHawk timeout (>10s) :
  → log warn + retourne []  (pas de crash)
  → retry x3 avec backoff 1s/2s/4s
```

### Docker Compose Production

```yaml
# docker/docker-compose.prod.yml
services:
  nginx:
    image: nginx:1.27-alpine
    ports: ["80:80", "443:443"]
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - certbot-certs:/etc/letsencrypt:ro
    depends_on: [web]
    restart: always

  web:
    build:
      context: ../
      dockerfile: docker/Dockerfile.web
    env_file: .env.production
    depends_on: [postgres, redis]
    restart: always

  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: travel_db
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  redis:
    image: redis:7-alpine
    command: >
      redis-server
      --maxmemory 512mb
      --maxmemory-policy allkeys-lru
      --save ""
    restart: always

volumes:
  postgres_data:
  certbot-certs:
```

### Logger non-bloquant (`apps/web/lib/logger.ts`)

```typescript
type Level = 'info' | 'warn' | 'error'
type Entry = { level: Level; msg: string; meta?: object }

const queue: Entry[] = []
let flushing = false

async function flush() {
  if (flushing || queue.length === 0) return
  flushing = true
  while (queue.length > 0) {
    const { level, msg, meta } = queue.shift()!
    if (process.env.NODE_ENV === 'production') {
      process.stdout.write(JSON.stringify({ ts: Date.now(), level, msg, ...meta }) + '\n')
    } else {
      console[level](`[${level.toUpperCase()}]`, msg, meta ?? '')
    }
  }
  flushing = false
}

export const logger = {
  info:  (msg: string, meta?: object) => { queue.push({ level: 'info',  msg, meta }); setImmediate(flush) },
  warn:  (msg: string, meta?: object) => { queue.push({ level: 'warn',  msg, meta }); setImmediate(flush) },
  error: (msg: string, meta?: object) => { queue.push({ level: 'error', msg, meta }); setImmediate(flush) },
}
```

---

## [MILESTONES]

### M1 — Foundation
**Verifiable Goal** : `pnpm dev` démarre ✓ | Login Google redirige vers dashboard ✓ | DB connectée ✓ | Switcher EN/FR fonctionnel ✓

- [ ] Init monorepo Turborepo + pnpm workspaces
- [ ] `packages/db` : Prisma schema + migrations + seed (20 hôtels, 10 vols, 10 tours, 10 voitures)
- [ ] `apps/web` : Next.js 16 + Tailwind 4 + shadcn/ui init
- [ ] Design tokens Rayan Travel dans `tailwind.config.ts`
- [ ] Logo SVG intégré (Rayan Travel Services LTD)
- [ ] next-intl : routing EN/FR + fichiers `messages/en.json` + `messages/fr.json`
- [ ] NextAuth : Google OAuth + email/password
- [ ] Header (logo + nav + switcher langue EN|FR + login) / Footer
- [ ] Middleware : auth guard + locale redirect
- [ ] Pages : `/auth/login`, `/auth/register`
- [ ] Docker Compose local (postgres + redis)
- [ ] Variables d'environnement documentées (`.env.example`)

### M2 — RateHawk + Search Flow
**Verifiable Goal** : Recherche "hôtel Paris 2 adultes" → résultats réels RateHawk ✓ | Filtres prix fonctionnels ✓

- [ ] `packages/ratehawk` : client base (retry, timeout, auth headers)
- [ ] `ratehawk/hotels.ts` + `flights.ts` + `activities.ts` + `cars.ts`
- [ ] `ratehawk/mapper.ts` : mapping types RateHawk → `@travel/types`
- [ ] Redis cache layer (`apps/web/lib/cache.ts`)
- [ ] HeroSearch 4 tabs + URL params
- [ ] `/search` : Server Component + filtres (prix, dates, rating)
- [ ] `ResultCard` générique polymorphique
- [ ] Pages détail : `/hotels/[slug]`, `/flights/[slug]`, `/tours/[slug]`, `/cars/[slug]`

### M3 — Booking Flow
**Verifiable Goal** : Réservation hôtel → paiement Stripe sandbox → page confirmation avec ID ✓

- [ ] Zustand cart store + persist localStorage
- [ ] `CartDrawer` + `/cart` page
- [ ] `/checkout` : `CheckoutForm` (react-hook-form + Zod)
- [ ] Stripe Payment Intent (Server Action)
- [ ] Webhook `/api/webhooks/stripe` → Booking `CONFIRMED`
- [ ] `/booking/[id]` : page confirmation
- [ ] `/account/bookings` : historique

### M4 — Admin Dashboard
**Verifiable Goal** : Admin crée un listing hôtel → visible dans /search ✓ | Change statut booking → DB mis à jour ✓

- [ ] `/admin` layout + sidebar + role guard (middleware)
- [ ] `/admin` : stats (count bookings, revenus, users actifs)
- [ ] `/admin/listings` : table + CRUD complet (Server Actions)
- [ ] `/admin/bookings` : liste + changement statut
- [ ] `/admin/users` : liste + toggle rôle

### M5 — VPS Deployment
**Verifiable Goal** : `https://domain.com` en prod ✓ | Lighthouse ≥ 90 perf + SEO ✓ | SSL valide ✓

- [ ] `docker/Dockerfile.web` optimisé (multi-stage build)
- [ ] `docker/docker-compose.prod.yml`
- [ ] `docker/nginx.conf` (gzip, cache headers, proxy_pass)
- [ ] Certbot SSL setup (script ou conteneur)
- [ ] GitHub Actions : build → SSH → docker compose up
- [ ] `generateMetadata` sur toutes les pages publiques
- [ ] Responsive audit (mobile 375px → desktop 1440px)
- [ ] Loading skeletons + Suspense boundaries
- [ ] Error boundaries

### M6 — Mobile React Native/Expo
**Verifiable Goal** : App installable via Expo Go ✓ | Recherche hôtel → résultats → détail ✓ | Login Google ✓

- [ ] `apps/mobile` : Expo SDK 53 init
- [ ] Navigation (Expo Router)
- [ ] Auth : Expo AuthSession → même endpoint NextAuth
- [ ] Screens : Home, Search, Detail, Cart, Checkout, Bookings
- [ ] Consomme `/api/search` et `/api/bookings` (REST endpoints déjà en place)
- [ ] Publish Expo EAS Build (APK + IPA)

---

## [ORPHANS & PENDING]

| Item                        | Statut        | Priorité | Note                                     |
|-----------------------------|---------------|----------|------------------------------------------|
| i18n Arabe (AR)             | Non scopé     | Post-M6  | RTL layout + next-intl 3ème locale        |
| Emails transactionnels      | Non scopé     | Post-M3  | Resend — confirmation booking, reset pwd |
| Notifications push mobile   | Non scopé     | Post-M6  | Expo Notifications + FCM                 |
| Rate limiting API routes    | Non scopé     | M5+      | Upstash Ratelimit ou middleware custom    |
| Tests E2E                   | Non scopé     | Post-M5  | Playwright (web) + Detox (mobile)        |
| Tests unitaires             | Non scopé     | Post-M4  | Vitest pour packages/ratehawk + schemas  |
| Monitoring erreurs          | Non scopé     | M5       | Sentry (web + mobile)                    |
| Analytics                   | Non scopé     | Post-M5  | Plausible (privacy-first)                |
| Système de reviews/ratings  | Non scopé     | Post-M5  | Feature creep — valider avant            |
| Multi-devise                | Non scopé     | Post-M5  | Dépend RateHawk currency support         |
| Système de promo/coupons    | Non scopé     | Post-M5  | Stripe Promotions Codes disponible       |

---

## [ENV VARIABLES]

```bash
# .env.example — à dupliquer en .env.local (dev) et .env.production (VPS)

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/travel_db"

# Redis
REDIS_URL="redis://localhost:6379"

# NextAuth
NEXTAUTH_URL="https://domain.com"
NEXTAUTH_SECRET="32-char-random-secret"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# RateHawk
RATEHAWK_API_KEY="..."
RATEHAWK_API_BASE_URL="https://api.worldota.net/api/b2b/v3"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# App
NEXT_PUBLIC_APP_URL="https://domain.com"
NODE_ENV="production"
```

---

## [DÉCISIONS ARCHITECTURALES — ADR]

| # | Décision                          | Raison                                                           |
|---|-----------------------------------|------------------------------------------------------------------|
| 1 | Monorepo Turborepo                | Mobile prévu → partage types, ratehawk SDK, prisma client        |
| 2 | Listing polymorphique (1 table)   | 4 types quasi-identiques → évite duplication schema              |
| 3 | Redis cache obligatoire           | RateHawk API = quotas + latence → cache TTL non négociable       |
| 4 | Server Actions pour mutations     | Évite API routes redondantes pour les mutations web              |
| 5 | API REST pour search + bookings   | Partagé web ET mobile sans duplication                           |
| 6 | next-auth v4 (pas v5)             | v4 = stable et documenté. v5 = migration si Next.js 17+          |
| 7 | pnpm workspaces                   | Plus rapide que npm, meilleur support monorepo que yarn           |
| 8 | Docker sans PM2                   | Restart policies Docker suffisantes, PM2 = complexité inutile    |
| 9 | metadata JSON dans Listing        | Flexibilité par type sans migration à chaque nouvelle propriété  |
| 10| next-intl EN + FR dès M1          | Routing localisé `/en/*` `/fr/*` — coût faible, dette évitée     |
| 11| Tokens Tailwind brand Rayan       | `brand-pink`, `brand-blue`, `brand-gradient` — cohérence totale  |
