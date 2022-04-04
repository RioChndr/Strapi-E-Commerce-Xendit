'use strict';

/**
 *  product-order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::product-order.product-order', ({ strapi }) => ({
  async create(ctx){
    ctx.request.body.data.user = ctx.state.user
    const res = await strapi.service('api::product-order.product-order').create(ctx.request.body)
    const sanitizedEntity = await this.sanitizeOutput(res, ctx);

    return this.transformResponse(sanitizedEntity);
  },

  async find(ctx){
    ctx.query = {
      ...ctx.query,
      filters: {
        user: ctx.state.user.id
      },
      populate: [
        'order_items',
        'order_items.product',
      ]
    }

    const res = await strapi.service('api::product-order.product-order').find(ctx.query)
    const sanitizedEntity = await this.sanitizeOutput(res, ctx);

    return this.transformResponse(sanitizedEntity);
  },
  async verifyPaymentXendit(ctx){
    let { external_id, status } = ctx.request.body

    if(status === 'PAID'){
      status = 'success'
    }
    let message = 'failed'

    try{
      const res = await strapi.service('api::product-order.product-order').updateStatus(external_id, status)
      message = 'success'
    }catch(err){
      console.log(err)
      message = err?.message ?? 'failed verify'
    }

    ctx.body = {
      external_id,
      status,
      message,
    }
  }
}));
