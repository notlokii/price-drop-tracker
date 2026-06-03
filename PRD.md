# PriceDrop — Product Requirements Document

> This file is the source of truth for this project.
> Before writing any code, read this file.
> Never deviate from the stack, structure, or phase plan defined here.

---

## What This App Does

PriceDrop is a personal price drop alert tracker. The user pastes a product URL
from any retail store (Hollister, Nike, ASOS, etc.), sets a target price, and
the app tracks that product automatically. Once a day the backend scrapes each
tracked product page, checks if the price has dropped to or below the target,
and sends an email alert if it has. The user has a clean dark dashboard showing
all tracked items, current prices, target prices, and price history charts.

---

## Who This Is For

A single user (the developer). This is a personal tool, not a SaaS product.
Auth exists to protect the data, not to support multiple public users.

---

## Tech Stack

| Layer          | Technology                        | Notes                                      |
| -------------- | --------------------------------- | ------------------------------------------ |
| Frontend       | React + Tailwind CSS (Vite)       | Dark theme, clean dashboard UI             |
| Backend        | Node.js + Express                 | REST API                                   |
| Database       | PostgreSQL hosted on Supabase     | Free tier                                  |
| ORM            | Prisma                            | Type-safe DB access                        |
| Scraping       | Puppeteer                         | Single product URLs only, once per day     |
| Scheduler      | node-cron                         | Runs daily price check automatically       |
| Auth           | JWT + bcrypt                      | Login/register, protected routes           |
| Email          | Resend                            | Free tier, sends price drop alerts         |
| Frontend Host  | Vercel                            | Free                                       |
| Backend Host   | Railway                           | Free tier                                  |

---

## Folder Structure

```
price-drop-tracker/
├── client/                          # React frontend (Vite)
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx           # Top nav with app name and + Track Item button
│       │   ├── ProductCard.jsx      # Card showing item name, price, target, status
│       │   ├── AddItemModal.jsx     # Modal with URL input and target price input
│       │   └── CardGrid.jsx         # Responsive grid that renders ProductCards
│       ├── pages/
│       │   ├── Dashboard.jsx        # Main page — shows all tracked items
│       │   ├── Login.jsx            # Login form
│       │   └── Register.jsx         # Register form
│       ├── App.jsx                  # Routes setup
│       ├── main.jsx                 # React entry point
│       └── index.css                # Tailwind import
│
└── server/                          # Node.js + Express backend
    ├── src/
    │   ├── routes/
    │   │   ├── items.js             # CRUD routes for tracked items
    │   │   └── auth.js              # Register and login routes
    │   ├── controllers/
    │   │   ├── itemsController.js   # Business logic for items
    │   │   └── authController.js    # Business logic for auth
    │   ├── middleware/
    │   │   └── auth.js              # JWT verification middleware
    │   ├── services/
    │   │   ├── scraper.js           # Puppeteer scrapeProduct(url) function
    │   │   └── mailer.js            # Resend email sending function
    │   ├── jobs/
    │   │   └── priceChecker.js      # node-cron daily job
    │   └── index.js                 # Express app entry point
    ├── prisma/
    │   └── schema.prisma            # DB schema
    ├── .env                         # Environment variables (never commit this)
    └── package.json
```

---

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  items     Item[]
}

model Item {
  id            String         @id @default(cuid())
  url           String
  name          String
  image         String
  currentPrice  Float
  targetPrice   Float
  lastChecked   DateTime?
  createdAt     DateTime       @default(now())
  userId        String
  user          User           @relation(fields: [userId], references: [id])
  priceHistory  PriceHistory[]
}

model PriceHistory {
  id        String   @id @default(cuid())
  price     Float
  checkedAt DateTime @default(now())
  itemId    String
  item      Item     @relation(fields: [itemId], references: [id])
}
```

---

## API Endpoints

### Auth
| Method | Route              | Description              | Auth Required |
| ------ | ------------------ | ------------------------ | ------------- |
| POST   | /auth/register     | Create new account       | No            |
| POST   | /auth/login        | Login, returns JWT token | No            |

### Items
| Method | Route         | Description                              | Auth Required |
| ------ | ------------- | ---------------------------------------- | ------------- |
| GET    | /items        | Get all items for logged-in user         | Yes           |
| POST   | /items        | Add new item (triggers scrape on submit) | Yes           |
| DELETE | /items/:id    | Delete a tracked item                    | Yes           |

---

## Environment Variables

```
# server/.env

DATABASE_URL=           # Supabase PostgreSQL connection string
JWT_SECRET=             # Random secret string for signing tokens
RESEND_API_KEY=         # From resend.com dashboard
PORT=5000
```

---

## Phase Build Plan

### Phase 1 — Static UI
**Goal:** Get the dashboard on screen with fake data. No backend yet.

Deliverables:
- React app with Tailwind dark theme set up
- Navbar component with app name and `+ Track Item` button
- ProductCard component with name, image, current price, target price, status badge
- CardGrid rendering a list of cards
- AddItemModal with URL input and target price input (does nothing on submit yet)
- 2-3 hardcoded fake items in Dashboard.jsx state

Done when: `npm run dev` shows a working dashboard at localhost:5173

---

### Phase 2 — Backend + Database
**Goal:** Replace fake data with a real database.

Deliverables:
- Express server running at localhost:5000
- Supabase PostgreSQL database created
- Prisma schema defined and migrated (`npx prisma migrate dev`)
- REST endpoints: GET /items, POST /items, DELETE /items
- React frontend connected to backend — cards load from DB, Add Item form saves to DB
- Delete button on each card works

Done when: Adding an item in the UI saves to the database and persists on refresh

---

### Phase 3 — Scraping
**Goal:** Pasting a URL auto-fills product name, price, and image.

Deliverables:
- `scraper.js` with a `scrapeProduct(url)` function using Puppeteer
- POST /items calls `scrapeProduct` before saving to DB
- ProductCard displays real scraped data
- Tested on at least: Hollister, Nike, ASOS

Notes:
- Hollister uses Cloudflare but single URL low-volume scraping works with Puppeteer
- Use `puppeteer-extra` + `puppeteer-extra-plugin-stealth` to reduce bot detection

Done when: Pasting a Hollister product URL creates a card with real product info

---

### Phase 4 — Auth
**Goal:** The app is private and each user owns their own data.

Deliverables:
- POST /auth/register and POST /auth/login endpoints
- Passwords hashed with bcrypt (never stored in plain text)
- JWT token returned on login, stored in localStorage on frontend
- All /items routes protected by auth middleware (verifies JWT)
- Items filtered by userId so users only see their own
- Login and Register pages in React
- Redirect to dashboard after login, redirect to login if no token

Done when: Logging in shows your items, logging out clears the session

---

### Phase 5 — Scheduler + Email Alerts
**Goal:** The app runs itself and emails you when a price drops.

Deliverables:
- `priceChecker.js` cron job that runs every 24 hours
- Job loops through all items, calls `scrapeProduct(url)` on each
- If new price <= targetPrice: send email via Resend with product name, old price, new price, link to product
- Update `currentPrice` and `lastChecked` in DB after each check
- Save each price check result to PriceHistory table

Done when: Changing a target price above current price triggers an email on the next cron run

---

### Phase 6 — Polish
**Goal:** Make it feel like a real app.

Deliverables:
- Price history chart per item using Recharts (line chart of price over time)
- Loading spinners while fetching data
- Toast notifications on add/delete (use react-hot-toast)
- Error handling for failed scrapes (show error state on card)
- Mobile responsive layout
- Deploy frontend to Vercel
- Deploy backend to Railway
- Set all environment variables in production dashboards

Done when: App is live on a public URL and works end to end

---

## Key Rules for Cursor

1. Always use the folder structure defined in this PRD
2. Never install packages outside the defined tech stack without a clear reason
3. Each phase must be fully working before starting the next
4. Never store passwords in plain text — always use bcrypt
5. Never commit the .env file
6. JWT tokens go in localStorage on the frontend
7. All /items routes must verify the JWT token via auth middleware
8. Scraping is low-volume and personal use only — one URL, once per day
9. Prisma is the only way to talk to the database — no raw SQL
10. Keep frontend and backend in separate folders with separate package.json files

---

## Current Status

Phase 1 — NOT started  
Phase 2 — Not started  
Phase 3 — Not started  
Phase 4 — Not started  
Phase 5 — Not started  
Phase 6 — Not started  

Update this section as phases are completed.
