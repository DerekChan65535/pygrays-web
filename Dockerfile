# Dockerfile

# Stage 1: Build the React application
# Use an official Node.js runtime as a parent image
FROM node:lts-alpine as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) first
# This leverages Docker layer caching
COPY package.json ./
# Use package-lock.json if available for deterministic installs
COPY package-lock.json ./

# Install project dependencies using npm ci for faster, reliable builds
# If you don't commit package-lock.json, you might use 'npm install' instead
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the application using Nginx
# Use a lightweight Nginx image
FROM nginx:stable-alpine

# Set the working directory for Nginx
WORKDIR /usr/share/nginx/html

# Remove default Nginx static assets
RUN rm -rf ./*

# Copy the built static files from the 'builder' stage
COPY --from=builder /app/build .

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Create custom Nginx configuration
RUN echo "server { \n\
    listen 80; \n\
    server_name localhost; \n\
    \n\
    root /usr/share/nginx/html; \n\
    index index.html index.htm; \n\
    \n\
    location / { \n\
        try_files \$uri \$uri/ /index.html; \n\
    } \n\
    \n\
    location ~* \\.(?:css|js|jpg|jpeg|gif|png|ico|webp|svg)\$ { \n\
        expires 1y; \n\
        add_header Cache-Control \"public\"; \n\
    } \n\
}" > /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Command to run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
