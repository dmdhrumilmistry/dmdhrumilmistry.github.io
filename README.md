# dmdhrumilmistry.github.io

Personal portfolio of Dhrumil Mistry, Senior Security Engineer at BrowserStack and project lead of OWASP OFFAT. It's a single static page hosted on GitHub Pages.

Live at [dmdhrumilmistry.github.io](https://dmdhrumilmistry.github.io).

## Features

- **Single page:** about, experience, open source, toolkit, vulnerabilities found, education and certifications, and contact.
- **Live GitHub projects:** repositories load from the GitHub REST API and are cached in `localStorage` for 24 hours. If the API is unreachable or rate limited, the page falls back to the snapshot in `assets/data/github.json`, and a status line says which source is shown.
- **Live avatar:** the photo loads from the GitHub account URL, with `assets/img/avatars/avatar.png` as a fallback.
- **No build step:** plain HTML, CSS and one script. Fonts come from Google Fonts.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | All page content |
| `assets/css/site.css` | Styles |
| `assets/js/github.js` | Loads, caches and renders GitHub projects and stats |
| `assets/data/github.json` | Offline snapshot of GitHub data |
| `assets/img/avatars/avatar.png` | Fallback avatar |

## Local development

```bash
git clone https://github.com/dmdhrumilmistry/dmdhrumilmistry.github.io.git
cd dmdhrumilmistry.github.io
python -m http.server 8000
```

Open http://localhost:8000. To bypass the 24 hour cache while testing, remove the `dm-gh-v1` key from `localStorage`.

## Refreshing the GitHub snapshot

The snapshot is only used when the live API fails. To refresh it, regenerate `assets/data/github.json` with the same shape: `generated`, `user`, `repos` (non-fork, non-archived) and `pinned` (currently `OWASP/OFFAT`).

## License

[MIT](LICENSE)
