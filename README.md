# Google Calendar Grafana Server

This plugin can help sync your Google Calendar events to Grafana.

## Prerequisites

To set up the OAuth consent screen, follow these steps:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Select your project or create a new one.
3. In the left sidebar, click on "OAuth consent screen".
4. Choose "External" or "Internal" user type and click "Create".
5. Fill in the required information such as "Application name" and "Authorized domains".
   - Set "Authorized domains" to `localhost` or your own domain
   - Set redirect URI to `http://localhost:9154/auth/google/callback` **(for local development)**
6. Click "Save" to save the changes.
   To set up the OAuth consent screen based on your environment, make sure to replace the following placeholders with your specific values:

## Installation/Running

### Setup

```bash
git clone https://github.com/NeoPrint3D/grafana-google-calendar .
cp .env.example .env # or create your own .env file where the docker image is going to be run
```

### Env housekeeping

- Replace `[YOUR_PROJECT_ID]` with your Google Cloud project ID.
- Replace `[YOUR_APPLICATION_NAME]` with the name of your application.
- Replace `[YOUR_AUTHORIZED_DOMAINS]` with the authorized domains for your application.
- Set `GOOGLE_OAUTH_CLIENT_ID` to your Google OAuth client ID.
- Set `GOOGLE_OAUTH_CLIENT_SECRET` to your Google OAuth client secret.
- Keep `GOOGLE_OAUTH_REDIRECT_URI` as `http://localhost:9154/auth/google/callback`.

### Running with bun

- Install [bun](https://bun.sh/docs/installation)

```bash
bun install
bun start
```

### Running with Docker

```bash
docker build -t grafana-google-calendar .
docker run -d -p 9154:9154 -v ./.env:/usr/src/app/.env --name=grafana-google-calendar grafana-google-calendar
# or
sh run.sh
```
## Test with curl 
```bash
curl --location 'http://machine-i7-12gb:9154/grafana' \
--header 'Content-Type: application/json' \
--data '{
    "calendarId": "primary"
}'
```

## License
