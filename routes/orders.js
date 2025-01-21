

const express=require('express');
const router=express.Router()
const { createMyOrder, createMyDivision, createMyCity, createMyArea, geatAllDivision, getCityByType, getAreaByType, confirmMyOrder, getOrderInfo, confirmMyPayment, getConfirmoredrInfoByUser } = require('../controllers/MyOrderController');
const verifyToken = require('../middleware/auth');

router.route('/orders').post(verifyToken,createMyOrder);
router.route('/orders/fetch').get(verifyToken,getOrderInfo);
router.route('/division').post(verifyToken,createMyDivision);
router.route('/division/fetch').get(geatAllDivision);
router.route('/city').post(verifyToken,createMyCity);
router.route('/city/fetchByType').get(getCityByType);
router.route('/area').post(verifyToken,createMyArea);
router.route('/area/fetchByType').get(getAreaByType);
router.route('/orders/confrim').post(verifyToken,confirmMyOrder);
router.route('/orders/confrimOrdersInfoByUser').get(verifyToken,getConfirmoredrInfoByUser);
router.route('/orders/confrim/create-checkout-session').post(verifyToken,confirmMyPayment);


module.exports=router;