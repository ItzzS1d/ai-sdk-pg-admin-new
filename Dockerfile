# Just a runtime container, no build
# FROM node:20-slim AS runner
# WORKDIR /app

# RUN apt-get update && apt-get install -y \
#     build-essential \
#     pkg-config \
#     libcairo2-dev \
#     libpango1.0-dev \
#     libjpeg-dev \
#     libgif-dev \
#     librsvg2-dev \
#     libgbm-dev

# ENV NODE_ENV=production

# # Copy only what’s needed for runtime
# COPY package.json ./
# COPY .next ./.next
# COPY public ./public
# COPY node_modules ./node_modules

# # Optionally copy .env if you need it
# COPY .env.production ./.env.production

# EXPOSE 3000
# CMD ["npm", "run", "start"]

# New Version

FROM node:20-slim AS builder

WORKDIR /app

# Temporarily disable strict-ssl for the build process only
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
RUN npm config set strict-ssl false

# Install necessary system dependencies for 'canvas' to compile on Linux
RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    libgbm-dev

COPY package.json  ./
# Run npm install inside the Docker container
# This might still hit SSL issues if the proxy inspects npm registry calls,
# but setting strict-ssl false above should cover it.
RUN npm install

# Build the Next.js application within the container
COPY . .
# The build command will now use the previously set npm config
RUN npm run build -- --webpack

# --- Stage 2: Runner Stage (Final, slim production image) ---
FROM node:20-slim AS runner

WORKDIR /app

# Re-enable standard security practices for the running application
ENV NODE_ENV=production
# Note: NODE_TLS_REJECT_UNAUTHORIZED=0 is insecure and generally not recommended
# unless you specifically need it to communicate with services that use self-signed certs (like maybe your local ollama container)

# Copy only the essential files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
