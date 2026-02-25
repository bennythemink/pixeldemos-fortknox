FROM nginx:alpine

# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy the downloaded site into the nginx html root
COPY ./site/ /usr/share/nginx/html/

EXPOSE 80
