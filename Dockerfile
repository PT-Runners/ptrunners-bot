FROM node:latest

RUN wget https://packages.microsoft.com/config/ubuntu/21.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && \
  dpkg -i packages-microsoft-prod.deb && \
  rm packages-microsoft-prod.deb; \
  apt-get update; \
  apt-get install -y apt-transport-https && \
  apt-get update && \
  apt-get install -y dotnet-runtime-6.0 && \
  rm -rf /var/lib/apt/lists/*

RUN mkdir -p /bot/src
WORKDIR /bot/src

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY src/package.json /bot/src/
RUN npm install

COPY . /bot

RUN node deploy-commands.js
CMD ["node", "index.js"]