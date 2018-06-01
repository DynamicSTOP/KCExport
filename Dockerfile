#based on node package https://hub.docker.com/r/_/node/
FROM node:8.11.2

RUN apt-get update && apt-get install -y \
    less \
    man \
    ssh \
    optipng \
    python \
    python-dev \
    python-pip \
    python-virtualenv \
    vim \
    && npm install -g @vue/cli \
    && npm install -g @vue/cli-init \
    && npm install -g @vue/cli-service-global

WORKDIR /app