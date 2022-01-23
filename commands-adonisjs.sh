# Creating a new project
npm init adonis-ts-app@latest rp-server


# Starting the development server
node ace serve --watch
# By default, the server starts on PORT 3333 (defined inside the .env file).  http://localhost:3333

# Compiling for production
node ace build --production
cd build
node server.js

# Make controller command
node ace make:controller Home
node ace make:controller Attestation

npm i @adonisjs/session


# Install SQLIte 
node ace configure @adonisjs/lucid
node ace migration:run

# Install MySQL
npm i mysql

#TO run mysql in docker
docker run --name march1st-mysql -p 3306:3306 -d -e MYSQL_ROOT_PASSWORD=mysql2022 mysql
docker exec -it march1st-mysql bash
mysql -u root -p
show databases;
CREATE DATABASE rpbackend
show databases;
CREATE USER 'rpbackenduser'@'localhost' IDENTIFIED BY 'mysql2022'
GRANT ALL PRIVILEGES ON rpbackend.* TO 'rpbackenduser'@'localhost'
