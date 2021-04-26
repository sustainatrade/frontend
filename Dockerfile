FROM node:10.24-alpine as builder

WORKDIR /app

COPY . /app

RUN yarn && yarn build

WORKDIR /app/server

RUN yarn

FROM node:10.24-alpine

WORKDIR /app

COPY --from=builder /app/build /app/build
COPY --from=builder /app/server /app/server
COPY --from=builder /app/package.json /app/package.json

RUN npm i nodemon -g

# COPY nginx/default.conf /etc/nginx/conf.d/
# RUN ls /etc/nginx/conf.d
# RUN cp /app/env /tmp/env -R

# CMD serve -s
# CMD ["nginx"]

# CMD yarn run server