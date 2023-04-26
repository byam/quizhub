FROM node:18-slim AS build

WORKDIR /usr/src/app
COPY package.json package-lock.json ./

# Install dependencies and copy them to the container
# Run ci only for the production dependencies
RUN npm ci
RUN npm install
COPY . .

# Build the Angular application for production
RUN npm run build --prod

# Configure the nginx web server
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/frontend /usr/share/nginx/html
EXPOSE 8080
# Run the web service on container startup.
CMD ["nginx", "-g", "daemon off;"]
