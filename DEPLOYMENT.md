# Deployment Instructions

This project is a React + Vite + Express application.

## Prerequisites

- VPS (e.g., DigitalOcean, Hetzner, Linode)
- Dokploy installed on your VPS
- GitHub repository connected to your Dokploy project

## Deployment Steps

1.  **Create a new application** in Dokploy.
2.  **Connect your GitHub repository**.
3.  **Select Nixpacks** as the build method.
4.  **Configure environment variables**:
    -   `APP_URL`: The domain where you will host the application (e.g., `https://your-domain.com`).
    -   `PORT`: `3000`
    -   `NODE_ENV`: `production`
5.  **Build and Deploy**.

## Dokploy Configuration (Nixpacks)

-   **Build Command**: `npm run build`
-   **Start Command**: `npm run start`
-   **Port**: `3000`
