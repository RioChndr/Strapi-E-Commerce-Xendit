'use strict';

/**
 * product-order service.
 */

const { createCoreService } = require('@strapi/strapi').factories;
const PaymentConfig = require('../../../../config/payment')
const Xendit = require('xendit-node')
const process = require('process')

module.exports = createCoreService('api::product-order.product-order', ({ strapi }) => ({
  async create(input) {
    const params = {...input}

    await this.findFixedPrice(params)

    const result = await super.create(params);
    console.log(input);
    let invoice = await this.createInvoice(result, params.data.user)
    if(invoice){
      await this.saveInvoiceId(invoice)
    }

    return result
  },

  async findFixedPrice(params){
    const filterId = params.data.order_items ? params.data.order_items.map((v) => v.product).filter((v) => !!v) : null
    if(!filterId) return;
    
    const products = await strapi.entityService.findMany('api::product.product', {
      fields: ['name', 'price'],
      filters: {
        id:{
          $in: filterId
        }
      },
    })
    const getProductFixedPrice = (id) => {
      let product = products.find((v) => v.id === id)
      if(!product) return 0
      return product.price
    }

    params.data.order_items = params.data.order_items.map((v) => ({
      ...v,
      price_fixed: getProductFixedPrice(v.product)
    }))

    params.data.price_total = params.data.order_items.map((v) => {
      return v.price_fixed * v.amount
    }).reduce((sum, curr) => sum + curr)
  },

  async createInvoice(result, user){
    const keyXendit = strapi.config.get('payment.xendit.key')
    const { Invoice } = new Xendit({
      secretKey: keyXendit
    })
    const invoiceClient = new Invoice()
    try{
      const paramInvoice = {
        externalID: result.id + '',
        customer: {
          email: user.email,
          given_names: user.username,
        },
        amount: result.price_total
      }
      let resInvoice = await invoiceClient.createInvoice(paramInvoice)
      result.meta = {
        invoice: resInvoice
      }
      return resInvoice
    }catch(err){
      console.log(`failed to send xendit`)
      console.log(err)
      throw err
    }
  },
  
  async saveInvoiceId(invoice){
    const invId = invoice.id
    const dataId = invoice.external_id
    
    await super.update(+dataId, {
      data: {
        xendit_invoice_id: invId
      }
    })
  },

  /**
   * 
   * @param {*} id Number/string
   * @param {*} status new, success, failed
   * @returns 
   */
  async updateStatus(id, status){
    if(!['new', 'success', 'failed'].includes(status)){
      status = 'new'
    }
    return await super.update(+id, {
      data: {
        status_order: status
      }
    })
  }
}));
