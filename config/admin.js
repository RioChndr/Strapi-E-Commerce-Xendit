module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '77c6c5ee47be2a5e59dfcfc9da845eca'),
  },
});
