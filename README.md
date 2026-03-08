# Andrea Musso – Portfolio

Personal portfolio site for **Andrea Musso**, Senior Web Developer. A single-page application showcasing experience in e-commerce, Shopify, WordPress, and front-end development.

---

## Features

- **Smooth scrolling** – [React Lenis](https://github.com/studio-freight/react-lenis) for fluid scroll
- **Animations** – GSAP-driven hero and section transitions
- **Responsive** – Mobile-first layout with dedicated mobile navigation
- **Sections** – Hero, About, Work, Skills, Services, Contact
- **Deployment** – Static build deployed to [Cloudflare Pages](https://pages.cloudflare.com/) via Wrangler

---

## Tech Stack

| Category   | Stack |
| ---------- | ----- |
| Framework  | React 18, TypeScript |
| Build      | Vite 6 |
| Styling    | Tailwind CSS, tailwindcss-animate |
| Animation  | GSAP, React Lenis |
| Icons      | Lucide React |
| Deploy     | Cloudflare Pages (Wrangler) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Yarn](https://yarnpkg.com/) (v1)

### Install

```bash
yarn install
```

### Develop

```bash
yarn dev
```

Runs the app at `http://localhost:5173` with hot reload.

### Build

```bash
yarn build
```

Output is in `dist/`. For production-optimized build:

```bash
yarn build:prod
```

### Preview production build

```bash
yarn preview
```

### Deploy to Cloudflare Pages

```bash
yarn deploy
```

Uses Wrangler to deploy the `dist/` folder as static assets with SPA fallback.

---

## Project Structure

```
src/
├── App.tsx              # Root layout, Lenis wrapper, section order
├── main.tsx             # Entry point
├── components/          # Hero, About, Work, Skills, Services, Contact, Navigation, etc.
├── hooks/               # useHeroAnimations, use-mobile, etc.
└── ...
```

---

## Scripts

| Command         | Description |
| --------------- | ----------- |
| `yarn dev`      | Start dev server |
| `yarn build`    | TypeScript + Vite build |
| `yarn build:prod` | Production build |
| `yarn preview`  | Preview production build |
| `yarn deploy`   | Deploy to Cloudflare Pages |
| `yarn lint`     | Run ESLint |

---

## License

Private – All rights reserved.
