FROM nginx:alpine

# VOLUME /app/env

WORKDIR /app
COPY build /app
COPY nginx/default.conf /etc/nginx/conf.d/
RUN ls /etc/nginx/conf.d
# RUN cp /app/env /tmp/env -R

# CMD serve -s
# CMD ["nginx"]
