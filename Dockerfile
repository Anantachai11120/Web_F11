FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Keep file-based data writable/persistent via volume mapping.
RUN mkdir -p /app/data

EXPOSE 3000

CMD ["npm", "start"]
