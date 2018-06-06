FROM node:alpine as builder

WORKDIR /app

COPY . /app

RUN yarn && yarn build

FROM nginx:alpine

# VOLUME /app/env

WORKDIR /app/dist

COPY --from=builder /app/build /app/dist

COPY nginx/default.conf /etc/nginx/conf.d/
RUN ls /etc/nginx/conf.d
# RUN cp /app/env /tmp/env -R

# CMD serve -s
# CMD ["nginx"]
