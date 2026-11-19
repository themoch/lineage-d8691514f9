# Lineage

Static site (no build step) hosted on GitHub Pages. Keep the `noindex`/`no-referrer` meta tags; don't publicize the URL.

## Data
Edit the JSON in `data/`:
- `strains.json`: `{id,label,source(archive|offsite|unknown|own),mine,flower,aroma,cross,url,breeder}`
- `edges.json`: `{child,parent,kind?}` (`kind`: `sel` = selection, `dash` = unconfirmed)
- `details.json`: map of strain id to `{type,seed,flower,height,yield,potency,aroma,blurb,grow,notes,src,conflict}`

Check with `node scripts/validate.mjs` (also runs in CI before deploy).

## Run locally
Pages `fetch` the JSON, so serve over http:
```
python3 -m http.server 8000
```

## Deploy
Push to `main`; `.github/workflows/pages.yml` validates and deploys. One-time: set Pages source to "GitHub Actions" (repo Settings > Pages).
