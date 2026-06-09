<div align="center">

# ◆ NexusOps

**Advanced Repository & Deployment Operations Hub**

_Precision, Real-time, Global Surveillance_

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## ◆ Design Philosophy

The design of NexusOps is heavily inspired by modern sci-fi interfaces and the UI aesthetics of Honkai: Star Rail. We have stripped away excessive borders, adopting high-contrast neon accents—Healthy (cyan/green), Warning (yellow), and Critical (red)—as visual anchors. Every card, panel, and micro-animation is built around the concept of a "Global Command Center," turning routine deployments and code reviews into an immersive experience.

## 〇一 Features

- **Global Activity Feed** — Receive real-time Vercel deployment statuses and GitHub operations in a centralized feed.
- **Direct PR Merge** — Merge Open Pull Requests directly from the dashboard without navigating away.
- **History Sync** — Fetch historical Commits and Pull Requests effortlessly using a GitHub Personal Access Token.
- **Multi-channel Alerts** — Seamlessly integrated with Discord Webhooks and Telegram Bots for real-time push notifications.
- **Sleek Micro-animations** — Powered by Framer Motion, delivering smooth, tech-infused transitions and hover effects.

---

## 〇二 Setup & Installation

If you'd like to deploy your own instance of NexusOps, follow these steps:

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/YourUsername/nexus-ops.git
cd nexus-ops
pnpm install
```

### 2. Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
# Generate a random string for Auth Secret (e.g., using `openssl rand -base64 32`)
BETTER_AUTH_SECRET="your_auth_secret_here"

# Your Database Connection String (PostgreSQL supported)
DATABASE_URL="postgresql://user:password@host:port/database"

# GitHub OAuth App Credentials (for OAuth Login Binding)
AUTH_GITHUB_ID="your_github_client_id"
AUTH_GITHUB_SECRET="your_github_client_secret"

# Internal Encryption Key (MUST be exactly 32 characters long)
# Used to securely encrypt Webhook URLs and API Tokens in the database
ENCRYPTION_KEY="your_32_characters_encryption_key"
```

### 3. Initialize Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Start the Development Server

```bash
pnpm dev
```

---

## 〇三 User Guide & Configuration

After successfully launching and logging into NexusOps, navigate to the **Settings** page to initialize your workspace and unlock its full potential.

### Account Binding
NexusOps supports Guest logins and Email authentication. It is highly recommended to click **Bind Account** in the Settings page to link your GitHub account for seamless future access.

### Configure GitHub PAT (Personal Access Token)
To allow the system to fetch Commits and PRs from private repositories (and perform direct merges), you need to configure a PAT:
1. Go to GitHub -> Settings -> Developer settings -> Personal access tokens -> Tokens (classic).
2. Click **Generate new token** and check the `repo` scope.
3. Paste the generated `ghp_...` token into the **Advanced Settings > GitHub Personal Access Token** field in NexusOps.

### Notification Integrations
1. **Discord**: Create a Webhook URL for your desired channel and paste it into the Discord field to receive deployment success/failure alerts.
2. **Telegram**: Use `@BotFather` to create a bot and get its Token, then retrieve your Chat ID and enter both in the Telegram settings.
- *💡 Note: All Tokens and Webhook URLs are strongly encrypted via `ENCRYPTION_KEY` before being stored in the database, ensuring your credentials remain secure.*

### Webhook Configuration
To enable GitHub and Vercel to push real-time events to NexusOps:
- Set your Vercel or GitHub Webhook URL to: `https://your-domain.com/api/webhook/github`
- The system automatically parses the incoming payloads, filtering out noisy `WARNING` (pending) states, and only logging the final `HEALTHY` (success) or `CRITICAL` (failure) records.

---

<div align="center">

_© 2026 NexusOps — Crafted for Commanders._

</div>
