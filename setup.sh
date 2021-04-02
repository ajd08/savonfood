#!/bin/bash
docker-compose down --volumes --rmi all
docker-compose up --build

