# Simple Mailer Service

A simple email service that sends messages to recipients.

## Overview

This API service serves to send email which utilises SendGrid as its service. It uses Fastify as its server, Joi for schema validation.

There are few endpoints available in within this API service:

**GET /health**

Used to check ping or check the up status of the service.

**POST /v1/mail/send**

Used to send in a request to send email to intended recipients, e.g.: to, cc, bcc.

Schema payload would look as below:

```
{
  to: ['jack@twitter.com'], // required, array of emails
  bcc: [], // array of emails
  cc: [], // array of emails
  content: 'Hi Jack!', // required, email message body content
}
```

Default subject of the email message is currently set as *Sent from Sendgrid*. On success of response, it shall return `202 Accepted`.

For any other error that relates to the payload, it will be serve with `400 Bad Request` and internal error within its logic will serve with `500 Internal server error`.

## Get started

To start the app in development mode with hot-reload, run the following command:

```sh
yarn start:dev
```

To start the app in production mode, run the following command:

```sh
# Make sure to run the build before starting the app
yarn build && yarn start
```

By default, the service is set to start by using port `3000`. However, you could set the port to listen based on your config through `PORT` environment name.

Head over to `http://localhost:3000` (if `PORT` not specified) to try it.

To be able to send email and content of this service, there are 2 main environment variables needed to be set.

`SENDGRID_EMAIL_SENDER` - used for indicating the sender email
`SENDGRID_API_KEY` - the SendGrid API key used for making request

## Testing

To run the test, run the following command:

```sh
yarn test
```

## Things to note

Currently, the email message is set to send in plain text format. There isn't any back-pressuring (rate-limitting) implemented on this service. For most part of the config, it can be found in the `src/config.js` file. Ideally, a pipeline will be implemented, given if this is to be pushed for production, which will do checks on linting, testing and formatting at minimal, before deploying it.

An endpoint is available to be used and try with at: `https://simple-mailer-service.herokuapp.com/v1/mail/send`.
