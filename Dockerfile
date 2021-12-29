FROM node:16.13

# Create working directory
WORKDIR /usr/src/march1st-backend

COPY --chown=node:node . ./

USER root

RUN npm install

#RUN npm i -g pm2

# Let all incoming connections use the port below
EXPOSE 8080

CMD node ace serve --watch

# CMD pm2 start node --name "March 1st Backend" -- ace serve --watch
# CMD ["/bin/bash","pm2 start node --name 'March 1st Backend' -- ace serve --watch"] 
# node ace serve --watch
# CMD npm run pm2:start
# D:\AWS\March 1st\Passwordless\rp-backend