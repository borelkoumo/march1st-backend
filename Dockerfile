FROM node:16.13

ENV NODE_ENV=production

# Create working directory
WORKDIR /usr/src/march1st-backend

# Copy dependencies files
COPY ["package.json", "./"]
COPY ["package-lock.json", "./"]
COPY [".env.production", "./.env"]

# install production dependencies
RUN pwd
RUN ls -al
RUN npm ci --production

# Copy application files
COPY --chown=node:node ./build ./

# install dependencies
# USER root
# RUN npm i

# Run migrations to create sqlite database schema
# RUN mkdir tmp
RUN node ace migration:run
# RUN chown -R node:node tmp
# RUN chmod -R ugo+rwx tmp

# Build production server
# RUN node ace build --production --ignore-ts-errors


# Let all incoming connections use the port below
EXPOSE 8080

RUN ls -nalp
# RUN cd build && ls -nalp

# Start production server
# CMD pwd && ls -al && cat .env && node server.js
CMD node server.js

# CMD pm2 start node --name "March 1st Backend" -- ace serve --watch
# CMD ["/bin/bash","pm2 start node --name 'March 1st Backend' -- ace serve --watch"] 
# node ace serve --watch
# CMD npm run pm2:start
# D:\AWS\March 1st\Passwordless\rp-backend