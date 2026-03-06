FROM node:20-bookworm-slim

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./
RUN npm install --omit=dev

COPY . .
RUN npm run build

# Keep file-based data writable/persistent via volume mapping.
RUN mkdir -p /app/data

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
