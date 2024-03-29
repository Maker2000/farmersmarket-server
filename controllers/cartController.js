
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
exports.getCart = async function(req, res){
    Cart.findOne({buyer:req.user._id}).populate('cartItem.product').exec(function(error, cartItems){
        if(error){
           return res.json({
                status: 'error',
                
                message: err,
                data: null
            });
        
        }
        return res.json({
        status: 'success',
        message: 'cart retrieved successfully',
        data: cartItems,
        });
    });
}
exports.addToCart = async function(req, res){
    var product = await Product.findOne(req.product);
    if(product.stockAmount < res.body.amount)
    return res.json({
        status: 'Error',
        message: 'Requested amount exceeds stock amount',
        data: null,
        });
    var existingCartUser = await Cart.findOne({buyer: req.user._id});

    if(existingCartUser)
    {   
        
        var existingCartItem = await Cart.findOne({buyer: req.user._id, 'cartItem.product': req.body.product});
       
       
        if(existingCartItem)
        try {
            //console.log(existingCartItem);
           // req.body.buyer = req.user._id;
            var carttItem = await Cart.findOneAndUpdate({buyer: req.user._id, "cartItem.product":req.body.product },{$set: {"cartItem.$.amount":existingCartItem.cartItem.find(item=>item.product == req.body.product._id).amount+req.body.amount}}, {new: true, upsert: true});
            return  res.json({
                status: 'success',
                message: 'Product added to cart successfully',
                data: carttItem,
                });
        } catch (error) {
            return res.json({
                status: 'error',
                
                message: error,
                data: null
            });
        }
        else{
            try {

                existingCartUser.cartItem.push(req.body);
                var ctItem = await existingCartUser.save();
                console.log(ctItem);
                return res.json({
                    status: 'success',
                    message: 'Product added to cart successfully',
                    data: ctItem,
                    });
            } catch (error) {
                return res.json({
                    status: 'error',
                    
                    message: error,
                    data: null
                });
            }
        }
        
    }
    else{
        try {
            req.body.buyer = req.user._id;
            var cartItem = await new Cart(req.body).save();
            return  res.json({
                status: 'success',
                message: 'Product added to cart successfully',
                data: cartItem,
                });
        } catch (error) {
            return res.json({
                status: 'error',
                
                message: error,
                data: null
            });
        }
    }
    
}
  

