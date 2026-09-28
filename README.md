# ARCA — real-estate agency website

Website for a real-estate agency in Chișinău, in Romanian and Russian, with an admin panel for listings
and leads. **ARCA is a fictional agency** — listings, agents and prices are demo data, marked as such on the site.

**Live demo:** https://arca-three-gamma.vercel.app

Built with AI-assisted development (Claude Code).

## Problem

Local agency sites are mostly lists of cards. A buyer's first questions — "what fits my budget in this
district?" and "is this price fair?" — are hard to answer, and agents often cannot update the site themselves.

## What I built

- Property search with filters kept in the URL, so a filtered list can be sent as a link (e.g. on WhatsApp)
- Property page with photo gallery, mortgage calculator and similar listings
- Pages for residential complexes, agents, a buyer's guide and a "sell your property" valuation form
- **Price index:** median €/m² per district and number of rooms, computed from the site's own listings;
  every listing shows its position against that median (labeled as asking prices, not transaction prices)
- **Admin panel** (`/admin`, password from an environment variable): add, edit and delete properties,
  view leads from all forms
- RO / RU interface, sitemap and robots generated from the data

## Stack

Next.js 16 (App Router), React 19, TypeScript (strict), CSS Modules. No UI library.

## The hard part

The first version of the admin panel was decorative: the site read a static list of properties while the
panel wrote to a separate data file, so a property added in the panel never appeared on the site.
The fix merges the versioned portfolio with the panel's data in one place and revalidates the affected
pages after every save. The full cycle (add → visible on the site → edit → delete) was then checked end to end.

## Run locally

```bash
npm install
echo "ADMIN_KEY=choose-a-password" > .env.local
npm run dev                  # http://localhost:3000, admin at /admin
```

## Limitations and what I would improve

- Admin data is stored in a JSON file on disk. On Vercel this file does not persist between deployments,
  so for real use it needs a database (e.g. PostgreSQL).
- Only 24 demo listings, so narrow filters quickly return no results.
- A property added from the panel gets one photo and a map pin at the district center.
- No automated tests yet.

Photos: Unsplash (free license).
