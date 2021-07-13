## BUILD
FROM node:14-alpine as builder
WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npm run build

## SERVE
FROM nginx:alpine
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /usr/src/app/build .
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]