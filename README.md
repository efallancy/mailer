# Simple Mailer Service

A simple email service that sends messages to recipients.

## Overview

This API service serves to send email which utilises [SendGrid](https://sendgrid.com/) as its service primary provider and [Mailgun](https://www.mailgun.com/) as its secondary provider.

It uses Fastify as its server, Joi for schema validation.

There are few endpoints available in within this API service:

**GET /health**

Used to ping or check the up status of the service.

**POST /v1/mail/send**

Used to send in a request to send email to intended recipients, e.g.: to, cc, bcc.

Schema payload would look as below:

```
{
  from: 'yoda@starwars.com', // required, email sender
  to: ['jack@twitter.com'], // required, array of emails
  bcc: [], // array of emails
  cc: [], // array of emails
  subject: 'Sent from Simple Mailer Service', // required, string format of email subject
  content: 'Hi Jack!', // required, string format of email message body content
}
```

On success of response, it shall return `202 Accepted`.

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

- `SENDGRID_API_KEY` - the SendGrid API key used for making request
- `MAILGUN_API_KEY` - the Mailgun API key used for making request
- `MAILGUN_DOMAIN_NAME` - the Mailgun Domain name key used for making request (Refer to Mailgun documentation to find out more)

## Testing

To run the test, run the following command:

```sh
yarn test
```

## Things to note

Currently, the email message is set to send in plain text format. There isn't any back-pressuring (rate-limitting) implemented on this service. For most part of the config, it can be found in the `src/config.js` file. Ideally, a pipeline will be implemented which will do checks on linting, testing and formatting at minimal, before deploying it for production.

An endpoint is available to be used and try with at: `https://simple-mailer-service.herokuapp.com/v1/mail/send`.

Also, do note that Mailgun requires domain name to be set and recommended to do so. Setting up and propagating the domain config in Mailgun would likely to take around 24-48 hours, which Mailgun would do some additional checking on their end. Alternatively, sandbox option is available but it requires recipient email to be whitelisted.
