module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/verify-payment/xendit',
      handler: 'product-order.verifyPaymentXendit',
      config: {
        auth: false
      }
    }
  ]
}