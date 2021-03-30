#!/bin/bash
psql --host=db --username=${POSTGRES_USER} --dbname=${POSTGRES_DB}
echo Hello World
