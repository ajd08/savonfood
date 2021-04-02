#!/bin/bash

docker-compose down --volumes --rmi all
docker-compose build --no-cache --force-rm
docker-compose up --build
