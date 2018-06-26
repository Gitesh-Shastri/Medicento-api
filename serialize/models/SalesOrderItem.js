const mongoose = require('mongoose');

const salesOrderItemsSchema = mongoose.Schema({
    sales_item_id: mongoose.Schema.Types.ObjectId,
    parent_order_item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SalesOrderItems'
    },
    company_name: {
        type: String
    },
    medicento_name: {
        type: String
    },
    sales_order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SalesOrder',
        required: true
    },
    inventory_product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory'
    },
    quantity: {
        type: Number,
        required: true
    },
    tax_amount: {
        type: Number
    },
    paid_price: {
        type: Number,
        required: true
    },
    total_amount: {
        type: Number,
        required: true
    },
    taxable_price: {
        type: Number
    },
    weight: {
        type: Number
    }, 
    created_at: {
        type: Date,
        required: true
    },
    strike_through_price: {
        type: Number
    },
    shipped_at: {
        type: String
    },
    delivered_at: {
        type: String
    },
    shipping_time: {
        type: String
    },
    shipping_service_id: {
        type: String
    },
    tracking_code: {
        type: String
    }
});

module.exports = mongoose.model('SalesOrderItems', salesOrderItemsSchema);