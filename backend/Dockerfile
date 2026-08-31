FROM node:20-alpine

WORKDIR /app

# Install Python and build tools for node-gyp (required by argon2)
RUN apk add --no-cache python3 make g++

# Copy package.json and lock file
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy application source
COPY . .

# Environment variables
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Use a non-root user for security
USER node

# Start the application
CMD ["npm", "start"]
