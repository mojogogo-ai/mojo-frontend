FROM  nginx:latest

COPY packages/portal-pc/dist /usr/share/nginx/html/portal/

COPY packages/portal-h5/dist /usr/share/nginx/html/portal-h5/

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


