## Country Browser (React + Vite)

Browse countries with search, filtering, sorting, and pagination. Built with React, Vite, Tailwind CSS, and TanStack Table.

### Getting Started

1) Install dependencies

```
npm install
```

2) Start the dev server

```
npm run dev
```

3) Open the app

```
http://localhost:5173
```

### Features

- **Data fetching**: Country data from `restcountries.com` via `src/api.js` (`getData`).
- **Table (TanStack Table)**:
  - **Pagination**: Client-side with page size selector and Prev/Next controls.
  - **Sorting**: Chevron icons (Lucide) to sort ascending/descending per column.
  - **Global search**: Filters across name, capital, region, subregion, timezone, currencies, and Google Maps link.
  - **Column filters**: Per-column text filters for all sortable columns.
  - **Columns**: Common Name, Official Name, Capital, Currency, Region, Subregion, Timezone, Google Maps (link), Flag.
- **Region tabs**: Header tabs to filter by region (plus All).

### Tech Stack

- React + Vite
- Tailwind CSS (v4 syntax)
- TanStack Table (`@tanstack/react-table`)
- Lucide React icons (`lucide-react`)

### Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run preview` – preview production build locally
