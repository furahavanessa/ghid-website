# Green Hope Initiative for Development (GHID) website

Bilingual (English / French) website for **Green Hope Initiative for Development**, a youth- and women-led nonprofit based in Goma, North Kivu, DR Congo.

> Cultivating peace. Inspiring critical thinking. Building resilient communities.

## Pages
Home · About us & team · Programs · Portfolio · Support us · News & gallery · Contact

## Structure
- `index.html` – the whole site (HTML, CSS and JavaScript in one file)
- `img/` – logo, photos and the Nyiragongo illustration

## Deploy on Vercel
1. Sign in at [vercel.com](https://vercel.com) with your GitHub account.
2. Click **Add New… → Project** and **Import** this repository.
3. Framework preset: **Other**. Leave *Build Command* and *Output Directory* empty (it is a static site).
4. Click **Deploy**. The site goes live at `https://<project>.vercel.app`.
5. Every push to `main` redeploys automatically.
6. Optional: add your own domain (e.g. `ghid-drc.org`) in **Project → Settings → Domains**.

## Still to complete
Content marked with a yellow dashed box on the site still needs real information:
- team names, short bios and social profile links (edit `TEAM_LINKS` in `index.html`)
- real testimonials (with permission)
- donation details (Mobile Money, bank, card, PayPal)
- organisation email address and social media links
- portfolio projects, news articles and downloadable reports
- the contact, volunteer and newsletter forms are not connected to an inbox yet
