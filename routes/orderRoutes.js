/*
Routes for Advanced APIs
This file defines the route for the advanced operations.
*/

import express from 'express';
import {
  getUsersWithOrders,
  getUsersWithOrdersAndProducts,
  getTotalAmountSpentByUsers,
  getMostOrderedProductPerUser,
} from '../controllers/orderController.js'; // Import the functions

const router = express.Router();

router.get('/users-with-orders', getUsersWithOrders); 
router.get('/users-with-orders-products', getUsersWithOrdersAndProducts);
router.get('/total-amount-spent', getTotalAmountSpentByUsers);
router.get('/most-ordered-product', getMostOrderedProductPerUser);

export default router;
