# 🚀 Strapi E-Commerce Integrated Xendit

E commerce concept strapi, integrated with xendit

## Configuration

Configuration App located at : `src/admin/app.js`, Change variable `name` and location logo image.

Fill .env file with configuration, [Check Configuration Strapi](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations.html)

## Setup

- Install package `yarn install` or `npm install`
- Build frontend admin `yarn build` or `npm run build`

## Xendit Integration

- Add xendit key to .env `XENDIT_KEY`
- Open [Xendit Developer](https://dashboard.xendit.co/settings/developers)
- Find "Callback Invoice", and fill `invoice paid` with url server `http://strapi-server.com/api/verify-payment/xendit`

## API Example

Strapi e commerce API posttman collection : **./Strapi e commerce.postman_collection.json**