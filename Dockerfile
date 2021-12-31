FROM node:16.13

ENV NODE_ENV=production

# Create working directory
WORKDIR /usr/src/march1st-backend

# Copy dependencies files
COPY ["package.json", "package-lock.json*", "./"]
COPY [".env.production", "./"]

# install production dependencies
RUN pwd && ls -al && npm ci --production

# Copy application files
COPY --chown=node:node ./build ./

# install dependencies
# USER root
# RUN npm i

# Run migrations to create sqlite database schema
RUN ls -al && mkdir tmp
RUN node ace migration:run -y

# Build production server
# RUN node ace build --production --ignore-ts-errors


# Let all incoming connections use the port below
EXPOSE 8080

RUN ls -nalp
# RUN cd build && ls -nalp

# Start production server
CMD pwd && ls -al && cat env.production &&  node server.js

# CMD pm2 start node --name "March 1st Backend" -- ace serve --watch
# CMD ["/bin/bash","pm2 start node --name 'March 1st Backend' -- ace serve --watch"] 
# node ace serve --watch
# CMD npm run pm2:start
# D:\AWS\March 1st\Passwordless\rp-backend