# Simple Mailer Service

A simple email service that sends messages to recipients.

## Overview

This API service serves to send email which utilises SendGrid as its service. It uses Fastify as its server, Joi for schema validation.

There are few endpoints available in within this API service:

**/health**

Used to check ping or check the up status of the service.

**/v1/mail/send**

Used to send in a request to send email to intended recipients, e.g.: to, cc, bcc.

## Get started

To start the app in development mode, run the following command:

```sh
yarn start:dev
```

To start the app in production mode, run the following command:

```sh
yarn start
```

By default, the service is set to start by using port `3000`. However, you could set the port to listen based on your config through `PORT` environment name.

To be able to send email and content of this service, there are 2 main environment variables needed to be set.

`SENDGRID_SENDER_EMAIL` - used for indicating the sender email
`SENDGRID_API_KEY` - the SendGrid API key used for making request

## Testing

To run the test, run the following command:

```sh
yarn test
```
