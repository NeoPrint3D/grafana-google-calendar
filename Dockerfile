FROM oven/bun

WORKDIR /usr/src/app

COPY package*.json bun.lockb ./
RUN bun install
COPY src/ ./src
COPY package.json ./

CMD [ "bun", "start" ]