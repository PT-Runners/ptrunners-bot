# PTRunners-bot

Bot for the [PTRunners Discord Server](https://discord.ptrunners.net)

It's my first time programming a bot. What started as an experiment is now a fully functional bot (or at least it's supposed to be). Please don't judge my poor design choices.

How to run:

- Clone the repo.

- Download [DiscordChatExporter](https://github.com/Tyrrrz/DiscordChatExporter), unzip and move it to the base folder. Name should be DiscordChatExporter.

- Put the correct id's on the config*.json files.

- Finally run:

```
docker build -t discord-bot .
docker run -dp 3000:3000 discord-bot
```
