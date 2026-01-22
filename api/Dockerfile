# Build Docker as keka-clone-api and push to Docker Hub
# docker buildx build --platform linux/amd64,linux/arm64 -t arpudhanaresh/keka-clone-api:latest --push .
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY tsoa.json ./
COPY tsconfig.json ./

# Install all dependencies (including devDependencies for building)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build:prod

# Production Stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built artifacts from builder stage
COPY --from=builder /app/build ./build

# Copy production env file
COPY .env.production .env

ENV PORT=3001
EXPOSE 3001

# Run the application
CMD ["npm", "run", "start:prod"]
