FROM node:16.13

# install dependencies
USER root
RUN pwd && ls -al && npm i

# Run migrations to create sqlite database schema
RUN mkdir tmp
RUN node ace migration:run

# Build production server
RUN node ace build --production --ignore-ts-errors

# Copy .env file to production
RUN cp .env build/.env.production

# install production dependencies
RUN cd build && npm ci --production

# Create working directory
WORKDIR /usr/src/march1st-backend

# Copy files
COPY --chown=node:node ./build ./

# Let all incoming connections use the port below
EXPOSE 8080

RUN pwd
RUN ls -nalp

# Start production server
CMD pwd && ls -al cat env.js && cat env.production && node server.js

# CMD pm2 start node --name "March 1st Backend" -- ace serve --watch
# CMD ["/bin/bash","pm2 start node --name 'March 1st Backend' -- ace serve --watch"] 
# node ace serve --watch
# CMD npm run pm2:start
# D:\AWS\March 1st\Passwordless\rp-backend