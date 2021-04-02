#!/bin/bash
cd /src/app/src
ts-node _scraper-getStores.ts >> /src/app/msg.log 2>&1
