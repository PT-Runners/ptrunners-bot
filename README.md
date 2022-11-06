# PTRunners-bot

Bot for the [PTRunners Discord Server](https://discord.ptrunners.net)

It's my first time programming a bot. What started as an experiment is now a fully functional bot (or at least it's supposed to be). Please don't judge my poor design choices.

How to run:

- Clone the repo.

- Download [DiscordChatExporter](https://github.com/Tyrrrz/DiscordChatExporter), unzip and move it to the base folder. Name should be DiscordChatExporter.

- Put the correct id's on the config*.json files.

- Finally run:

```
docker-compose up -d --build
```

For ssl and reverse proxy we are using Caddy

How to do:

```
cp data/caddy/Caddyfile.example data/caddy/Caddyfile  

docker-compose -f docker-compose.yml -f docker-compose.caddy.yml up -d --build
#or
cp docker-compose.caddy.yml docker-compose.override.yml
docker-compose up -d --build
```
