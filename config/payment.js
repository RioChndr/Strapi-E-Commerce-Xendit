module.exports = ({ env }) => ({
  xendit: {
    key: env('XENDIT_KEY', null)
  },
})