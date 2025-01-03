# Push image from local repo to remote repo
git add .; git commit -m "Refactoring Docker image" ; git push

# Pull and build Docker image
sudo -i
cd /home/ec2-user/march1st-backend
git pull && node ace build --production --ignore-ts-errors && docker rm -f march1st-backend && docker rmi march1st-backend && docker build -t "march1st-backend" . && docker run -itd --name march1st-backend -p8080:8080 march1st-backend && docker logs --follow --tail 100 march1st-backend

# Run container
docker run -itd --name march1st-backend -p8080:8080 march1st-backend

# Get logs
docker ps -a
docker logs --follow --tail 100 march1st-backend

# get container ip
 docker inspect march1st-mysql | grep '"IPAddress"' | head -n 1
