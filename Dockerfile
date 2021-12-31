FROM node:16.13

# Create working directory
WORKDIR /usr/src/march1st-backend

# Copy files
COPY --chown=node:node . ./

# install dependencies
USER root
RUN npm i

# Run migrations to create sqlite database schema
RUN mkdir tmp
RUN node ace migration:run

# Build production server
RUN node ace build --production --ignore-ts-errors

# install production dependencies
RUN cd build && npm ci --production

# Let all incoming connections use the port below
EXPOSE 8080

RUN ls -nalp
RUN cd build && ls -nalp

# Start production server
CMD node server.js

# CMD pm2 start node --name "March 1st Backend" -- ace serve --watch
# CMD ["/bin/bash","pm2 start node --name 'March 1st Backend' -- ace serve --watch"] 
# node ace serve --watch
# CMD npm run pm2:start
# D:\AWS\March 1st\Passwordless\rp-backend