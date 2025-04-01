FROM node:20.15.0-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --include=dev

COPY . .

RUN npm run build

FROM node:20.15.0-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/postcss.config.mjs ./postcss.config.mjs

CMD ["npm", "run", "start", "--", "-H", "0.0.0.0"]
