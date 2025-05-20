# FROM node:lts-alpine as build-stage

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run build


 

# # production stage

# FROM nginx:stable as production-stage

# COPY --from=build-stage /app/build/ /var/www/

# RUN rm /etc/nginx/conf.d/default.conf

# COPY ./nginx.conf /etc/nginx/conf.d/default.conf



FROM node:16-alpine

RUN mkdir -p /usr/app/
WORKDIR /usr/app

COPY ./ ./

RUN npm install --force
RUN npm run build

EXPOSE 8080
CMD ["npm","start"]
