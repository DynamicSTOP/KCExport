#based on node package https://hub.docker.com/r/_/node/
FROM node:8.11.2

RUN apt-get update && apt-get install -y \
    less \
    man \
    ssh \
    optipng \
    vim

WORKDIR /app