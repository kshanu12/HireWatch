FROM node:16-alpine
WORKDIR /app

# ARG DATABASE_URL

COPY package*.json ./
RUN npm install

# COPY prisma ./prisma/

COPY . .

# RUN npx prisma generate
# RUN echo "db url is ${DATABASE_URL}"
# RUN npx prisma migrate deploy
# RUN npx prisma migrate dev --name init
EXPOSE 8080
CMD ["node","index.js"]
