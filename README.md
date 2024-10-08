# What's Up?

Track your day from one place.

![Screenshot](https://github.com/timmo001/whats-up/raw/master/resources/screenshot.png)

## Development

### Setup

Setup environment variables:

```bash
cp .env.example .env
```

Now add your own values to the `.env` file. We are using [Turso](https://turso.tech) for our database but you can use any SQLite database, local or hosted.

### Install and run

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

## Deployment

You can deploy the app using any service that supports Next.js.
