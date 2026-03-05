# ----------------------
# Stage 1: Build
# ----------------------
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first (for layer caching)
COPY package*.json ./
RUN npm ci

# Copy rest of the project
COPY . .

# Build production files
ARG VITE_API_URL
RUN npm run build


# ----------------------
# Stage 2: Serve with Nginx
# ----------------------
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built app
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
