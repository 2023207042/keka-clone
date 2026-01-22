# Keka Clone API

This is the backend API for the Keka Clone application.

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose (for containerization)

## Local Development

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Generate Routes & Run (Dev):**
    ```bash
    npm run build
    npm start
    ```

    - `npm run build` generates the TSOA routes (`src/routes`).
    - `npm start` uses `ts-node` to run the server.

## Production Build (Local)

To compile the TypeScript code to JavaScript for production:

```bash
npm run build:prod
npm run start:prod
```

## Docker

### 1. Running Locally (Docker Compose)

Use Docker Compose to build and run the production image locally. This simulates the production environment with `.env.production`.

```bash
docker-compose up --build
```

- App runs on: `http://localhost:3001`
- Hot reload is **disabled** (this is for verifying the production build).

### 2. Building for Production (Multi-Architecture)

To build the image for both AMD64 (Standard Servers) and ARM64 (Apple Silicon/AWS Graviton) and push to Docker Hub:

**One-time Setup:**
If you haven't configured a multi-arch builder yet:

```bash
docker buildx create --name multiarch-builder --driver docker-container --use
docker buildx inspect --bootstrap
```

**Build & Push:**

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t arpudhanaresh/keka-clone-api:latest --push .
```

**Note:** This command embeds `.env.production` into the image as `.env`. make sure your image repository is private or does not contain sensitive secrets.
