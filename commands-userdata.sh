#!/bin/bash
cd /home/ec2-user
######################### Install HTTPD #########################
# Just to prevent errors, if somebody changed current working directory
cd /home/ec2-user

sudo yum update -y
sudo yum install httpd -y 
sudo systemctl start httpd
sudo systemctl enable httpd

# Create index file
EC2AZ=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone)
echo "<h1>Instance disponible dans l'AZ $EC2AZ</h1>" > /var/www/html/index.html

######################### Install EC2 METADATA #########################
# Just to prevent errors, if somebody changed current working directory
cd /home/ec2-user

# Installer les outils pour les metadata de l'instance
curl -sL https://s3.amazonaws.com/ec2metadata/ec2-metadata -o ec2-metadata
chmod u+x ec2-metadata

######################### Install node #########################
# Just to prevent errors, if somebody changed current working directory
cd /home/ec2-user

curl -sL https://rpm.nodesource.com/setup_16.x -o setup_16.x
sudo bash setup_16.x
sudo yum install nodejs -y 

######################### Install wscat #########################
# Just to prevent errors, if somebody changed current working directory
cd /home/ec2-user

sudo npm install -g wscat


######################### Install CODEDEPLOY AGENT #########################
# Just to prevent errors, if somebody changed current working directory
cd /home/ec2-user

# Installing CodeDeploy Agent
sudo yum update -y
sudo yum install ruby -y

# GET Current AWS REGION
CURRENT_REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/region)
# Download the agent (replace the region)
wget https://aws-codedeploy-$CURRENT_REGION.s3.$CURRENT_REGION.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto
sudo service codedeploy-agent status

# To start agent if not started
#sudo service codedeploy-agent start
# To erase CodeDeploy agent
#sudo yum erase codedeploy-agent -y


######################### Install GIT #########################
# Just to prevent errors, if somebody changed current working directory
cd /home/ec2-user

sudo yum install git -y

######################### Install PM2 #########################
# Just to prevent errors, if somebody changed current working directory
cd /home/ec2-user

sudo npm i -g pm2

######################### Install JAVA JDK CORETTO 11  #########################
# Amazon Corretto is a no-cost, multiplatform, production-ready distribution of the Open Java Development Kit (OpenJDK). 
# Corretto comes with long-term support that includes performance enhancements and security fixes. 
# Corretto is certified as compatible with the Java SE standard and is used internally at Amazon for many production services. 
# With Corretto, you can develop and run Java applications on operating systems such as Amazon Linux 2, Windows, and macOS.
cd /home/ec2-user

sudo yum install java-11-amazon-corretto -y


######################### Install DOCKER #########################
sudo yum install docker -y
sudo systemctl enable docker.service
sudo systemctl start docker.service

