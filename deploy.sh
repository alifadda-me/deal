#!/bin/bash

aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCESS_KEY_ID.dkr.ecr.$AWS_REGION.amazonaws.com

docker stack deploy --with-registry-auth -c ./docker-compose.yaml application-stack-name
