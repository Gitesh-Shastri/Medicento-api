const mongoose = require('mongoose');

const salesOrderItemsSchema = mongoose.Schema({
    sales_item_id: mongoose.Schema.Types.ObjectId,
    parent_order_item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SalesOrderItems'
    },
    sales_order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SalesOrder',
        required: true
    },
    inventory_product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    tax_amount: {
        type: Number,
        required: true
    },
    paid_price: {
        type: Number,
        required: true
    },
    taxable_price: {
        type: Number,
        required: true
    },
    weight: {
        type: Schema.Types.Decimal128,
        required: true
    }, 
    timestamps: true,
    strike_through_price: {
        type: Number,
        required: true
    },
    shipped_at: {
        type: String,
        required: true
    },
    delivered_at: {
        type: String,
        required: true
    },
    shipping_time: {
        type: String,
        required: true
    },
    shipping_service_id: {
        type: string,
        required: true
    },
    tracking_code: {]
        type: string,
        required: true
    }
});

module.exports = mongoose.model('SalesOrderItems', salesOrderItemsSchema);