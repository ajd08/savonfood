## Docker Image which is used as foundation to create
## a custom Docker Image with this Dockerfile
#FROM node:10
# 
## A directory within the virtualized Docker environment
## Becomes more relevant when using Docker Compose later
#WORKDIR /usr/src/app
# 
## Copies package.json and package-lock.json to Docker environment
#COPY package*.json ./
# 
## Installs all node packages
#RUN npm install
# 
## Copies everything over to Docker environment
#COPY . .
# 
## Uses port which is used by the actual application
#EXPOSE 3000
# 
## Finally runs the application
#CMD [ "npm", "start" ]

FROM node:alpine
LABEL description="Instant high-performance GraphQL API for your PostgreSQL database https://github.com/graphile/postgraphile"

# Install PostGraphile and PostGraphile connection filter plugin
RUN npm install -g postgraphile
RUN npm install -g postgraphile-plugin-connection-filter
RUN npm install -g @graphile-contrib/pg-simplify-inflector

EXPOSE 3000
#ENTRYPOINT ["postgraphile", "-n", "0.0.0.0","--subscriptions","--watch","--dynamic-json",,"--show-error-stack","json", "--enhance-graphiql","--enable-query-batching","--legacy-functions-only"]
ENTRYPOINT ["postgraphile", "-n", "0.0.0.0", "--enhance-graphiql","--subscriptions","--watch","--show-error-stack","json","--enable-query-batching","--legacy-functions-only","--dynamic-json"]
