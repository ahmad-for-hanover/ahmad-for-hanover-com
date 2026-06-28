# Ahmad for Hanover Township Committee

Campaign website for **Ahmad Saleh**, Democrat for Hanover Township Committee
(Morris County, New Jersey). General election: **November 3, 2026**.

The site introduces the candidate, lays out the issues, and gives neighbors a way
to get involved and donate. It is a single-page, content-first site built to load
fast, read well on a phone, and be cheap and simple to operate through election day.

> Production domain (pending purchase): **www.ahmadforhanover.com**

---

## Tech stack

Deliberately minimal. No framework, no build step, no dependencies to keep current.

| Layer | Choice |
|-------|--------|
| Markup | Static HTML5 (`index.html`) |
| Styles | Hand-authored CSS3 with custom properties (design tokens) |
| Scripts | Vanilla JavaScript, one small file (mobile nav toggle only) |
| Type | Google Fonts: EB Garamond (display) + Source Sans 3 (body/UI) |
| Hosting | AWS S3 (private bucket) behind Amazon CloudFront |
| TLS | AWS Certificate Manager (ACM) |
| DNS | Amazon Route 53 |
| CI/CD | GitHub Actions, deploying via GitHub OIDC (no long-lived AWS keys) |

There is nothing to install or compile. The browser loads the three source files
directly.

---

## Project structure

```
.
├── index.html              # The whole page (one-page site, anchor-linked sections)
├── styles/
│   └── style.css           # All styles. Design tokens live in :root at the top.
├── scripts/
│   └── scripts.js          # Mobile nav toggle, nothing else
├── assets/
│   └── images/             # Photography and graphics
└── .github/
    └── workflows/
        └── deploy.yml      # S3 + CloudFront deploy pipeline
```

Paths are kept **relative** so they resolve from the S3 bucket root, where
`index.html` is the default root object.

---

## Local development

No tooling required.

- **Quickest:** open `index.html` in a browser.
- **Closest to production** (recommended, so relative paths and fonts behave):
  serve the folder over HTTP from the project root, e.g.

  ```bash
  python3 -m http.server 8080
  # then visit http://localhost:8080
  ```

Google Fonts load over the network, so a live connection is needed to see the
correct typefaces.

---

## Design system (locked)

The palette and type are a fixed design system. The single source of truth is the
`:root` token block at the top of `styles/style.css`. Do not introduce off-system
colors; extend the tokens instead.

**Palette**

| Token | Hex | Role |
|-------|-----|------|
| `--blue` | `#173A6B` | Primary |
| `--gold` | `#CBA135` | Accent only, never large fills, never body text |
| `--slate` | `#4A5568` | Support / body text |
| `--light-blue` | `#A9CCEE` | Fills / backgrounds, never text |
| `--cream` | `#F4EFE3` | Warm ground |
| `--white` | `#FFFFFF` | Clean ground (masthead, About) |

**Type**

- **EB Garamond** for headlines, logo, and large display only.
- **Source Sans 3** for all body, nav, labels, buttons, and fine print.
- Rule of thumb: big serif moments, clean sans everywhere else.

**Contrast / accessibility**

- Gold is an accent and never carries body text.
- Light blue is a fill and never carries text.
- Body copy stays slate or deep blue on a light ground.
- Aim for WCAG AA on text.

**Required on the page**

- Footer disclaimer, verbatim: `Paid for by Ahmad for Hanover Township Committee`

---

## Branching and contribution workflow

The `main` branch is **protected**. Nothing is committed directly to it.

1. Branch off `main` for your change:
   ```bash
   git switch -c <type>/<short-description>   # e.g. feat/issues-copy
   ```
2. Commit using the prefix convention below.
3. Push the branch and open a Pull Request into `main`.
4. Once the PR is merged, the deploy pipeline runs automatically (see below).

### Commit message prefixes

We use Conventional Commit prefixes: `prefix: short imperative summary`.

| Prefix | Use it for |
|--------|------------|
| `feat:` | A new section, component, or piece of functionality |
| `fix:` | A bug fix (broken link, layout break, bad path) |
| `content:` | Campaign copy and text changes (no structural change) |
| `style:` | Visual/CSS changes (color, spacing, type) that don't change content |
| `refactor:` | Restructuring markup or CSS with no visible change |
| `docs:` | README or other documentation |
| `chore:` | Tooling, config, assets, housekeeping |
| `ci:` | Changes to the GitHub Actions workflow |

Examples:

```
feat: add Donate section with placeholder ActBlue CTA
content: finalize hero headline and subhead
style: convert masthead to white background
fix: correct script path so mobile nav toggle loads
ci: exclude docs from the S3 sync
```

---

## Deployment

Deploys are fully automated through GitHub Actions. The workflow is defined in
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

**Trigger:** every push to `main`. Because `main` is protected, in practice this
means **a merged Pull Request**.

**What runs:**

1. **Authenticate to AWS via OIDC.** The workflow assumes a dedicated IAM role
   using GitHub's OpenID Connect provider. No AWS access keys are stored in the
   repository.
2. **Sync to S3.** `aws s3 sync` uploads the site to the bucket with `--delete`,
   so the bucket mirrors the repo exactly (the `.git` and `.github` directories
   are excluded).
3. **Invalidate CloudFront.** A cache invalidation (`/*`) is issued so the new
   content is served immediately rather than waiting for TTLs to expire.

The bucket is private; it is reached only through CloudFront via Origin Access
Control, with HTTPS terminated at CloudFront using the ACM certificate.

> Note: because the S3 sync uploads everything except `.git` and `.github`, repo
> files like this README are also copied to the bucket. They are harmless (nothing
> links to them and CloudFront serves `index.html` as the root object), but the
> sync can be tightened with `--exclude` if you'd prefer the bucket to hold only
> served assets.

---

## Domain

The site will be served at **www.ahmadforhanover.com** once the domain is
purchased. Bringing it online involves: registering the domain (or pointing its
nameservers at Route 53), issuing/validating an ACM certificate in `us-east-1` for
CloudFront, adding the domain as an alternate name (CNAME) on the CloudFront
distribution, and creating the Route 53 alias records.

---

## Roadmap / deferred

These are intentionally not built yet:

- Domain purchase and DNS cutover (www.ahmadforhanover.com)
- ActBlue donation integration (Donate button is a placeholder)
- Volunteer / email capture (e.g. VAN) on Get Involved
- Analytics
- Secondary content: real Issues copy, Events listings, Endorsements

---

_Paid for by Ahmad for Hanover Township Committee._
