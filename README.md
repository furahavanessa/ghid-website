# Green Hope Initiative for Development (GHID) – Website

Bilingual (English / French) website for **Green Hope Initiative for Development**, a youth- and women-led nonprofit based in Goma, North Kivu, DR Congo.

> Cultivating peace. Inspiring critical thinking. Building resilient communities.

## Folder structure

```
ghid-site/
├── index.html          Home page (Nyiragongo hero, doves, impact numbers, programs)
├── about.html          About us: story, mission, vision, values, team
├── programs.html       The 4 programs
├── portfolio.html      Project sheets
├── support.html        Donate, partner, volunteer, sponsor, documents
├── news.html           News articles and photo gallery
├── contact.html        Address, phone, contact form, FAQ
├── css/
│   └── style.css       All the design: colours, fonts, layout
├── js/
│   ├── main.js         Menu, EN/FR switch, doves, forms, gallery, counters
│   ├── lang-init.js    Loads the saved language before the page appears
│   └── team-links.js   ← Team LinkedIn / Facebook / X links (edit this)
├── img/                Logo, photos, Nyiragongo illustration, icons
├── favicon.ico         Browser tab icon
├── site.webmanifest    Icon for phones ("Add to home screen")
└── vercel.json         Vercel settings
```

## How to edit

| I want to…                         | Open this file |
|------------------------------------|----------------|
| Change text on a page              | the page's `.html` file. English is in `<span class="en">`, French in `<span class="fr">` – change both. |
| Change colours or fonts            | `css/style.css` (colours are at the top, in `:root`) |
| Add a team member's social links   | `js/team-links.js` |
| Add or change a partner logo       | put the logo (PNG, ideally transparent) in `img/partners/` named `pole-institute.webp`, `international-alert.svg`, `yale-model-african-union.png` or `kofi-annan-foundation.svg` (the names and formats `index.html` expects). The Yale logo is white, so its tile has a dark green background. Until a file is there, the partner's name is shown. To add a partner, copy one `<li class="partner">` line in `index.html`. |
| Replace a photo                    | put the new photo in `img/` with the same name, or change the `src="img/…"` in the page |
| Change the menu or footer          | the header and footer are repeated in every `.html` file – change all 7 |

## Deploy on Vercel
1. Upload this folder to a GitHub repository.
2. Sign in at [vercel.com](https://vercel.com) with GitHub → **Add New… → Project** → **Import** the repository.
3. Framework preset: **Other**. Leave Build Command and Output Directory empty.
4. Click **Deploy**. The site is live at `https://<project>.vercel.app`, and every push to `main` updates it.
5. Optional: add your own domain in **Project → Settings → Domains**.

You can also open `index.html` directly in a browser to preview the site on your computer.

## Still to complete
Content shown in a yellow dashed box still needs real information:
- team names, short bios and social links (`js/team-links.js`)
- real testimonials (with permission)
- donation details (Mobile Money, bank, card, PayPal)
- organisation email address and social media links
- portfolio projects, news articles and downloadable reports
- the contact, volunteer and newsletter forms are not yet connected to an inbox

## Hosting on DirectAdmin

1. In DirectAdmin open **File Manager** → `domains/ghidcongo.org/public_html`.
2. Delete the default `index.html` there (if any), then **Upload** the zip and **Extract** it in `public_html`
   (the files `index.html`, `contact.php`, `.htaccess` and the folders `css`, `js`, `img` must sit directly in `public_html`).
3. Open the site. That's it: it is plain HTML, CSS and JavaScript, plus `contact.php` for the form.

**Clean addresses.** `.htaccess` shows pages as `ghidcongo.org/contact` instead of `contact.html`
(old `.html` links redirect automatically). Links inside the site use `/contact`, `/about`… so,
to preview the site on your own computer, open it through a local server rather than double-clicking `index.html`.
`.htaccess` is a hidden file: in File Manager make sure it was extracted too.

## Contact form

`contact.html` sends messages to **info@ghidcongo.org** through `contact.php`, using the server's own mail system,
so **no password is stored anywhere**. Just make sure the mailbox exists:
DirectAdmin → **E-mail Manager → E-mail Accounts** → `info@ghidcongo.org`.

To send to another address, change `$TO` at the top of `contact.php`.
If sending fails, visitors see a link to email info@ghidcongo.org directly, so no message is lost.
