# Build stage
FROM node:alpine as builder
WORKDIR '/app'
COPY . .
RUN npm install
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]