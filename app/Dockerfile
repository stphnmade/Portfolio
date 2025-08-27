FROM node:20-alpine

WORKDIR /app

# Install deps
COPY package.json package-lock.json* ./
RUN npm ci

# Copy app source
COPY . .

# Build Next.js app
RUN npm run build

# Run production server
EXPOSE 3000
CMD ["npm", "start"]
