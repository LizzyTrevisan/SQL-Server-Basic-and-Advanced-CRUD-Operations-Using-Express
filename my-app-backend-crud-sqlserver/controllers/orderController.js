/*
Advanced CRUD with JOIN queries
This file handles advanced operations with joins between users and orders.
*/

import sql from 'mssql';
import { config } from '../config/dbConfig.js';

// Get users with their orders (JOIN example)
export const getUsersWithOrders = async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query(`
      SELECT u.id, u.name, o.orderDate, o.amount 
      FROM Users u
      JOIN Orders o ON u.id = o.userId
    `); // Join Users and Orders tables
    res.json(result.recordset); // Return the result set
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve users with orders' });
  }
};


// Get users with their orders and ordered products (multi-level JOIN example)
export const getUsersWithOrdersAndProducts = async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query(`
      SELECT u.id, u.name, o.orderDate, o.amount, p.productName, p.price
      FROM Users u
      JOIN Orders o ON u.id = o.userId
      JOIN OrderDetails od ON o.id = od.orderId
      JOIN Products p ON od.productId = p.id
    `); // Join Users, Orders, OrderDetails, and Products tables
    res.json(result.recordset); // Return the result set
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve users with orders and products' });
  }
};


// Get total amount spent by each user (GROUP BY)
export const getTotalAmountSpentByUsers = async (req, res) => {
 try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
      SELECT 
        u.id AS userId,
        u.name AS userName,
        SUM(o.amount) AS totalSpent
      FROM Users u
      JOIN Orders o ON u.id = o.userId
      GROUP BY u.id, u.name
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('getTotalAmountSpentByUsers error:', err);
    res.status(500).json({ error: err.message || 'Failed to calculate total amount spent by users' });
  }
};


// Get the most frequently ordered product per user (Subquery)
export const getMostOrderedProductPerUser = async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query(`
      SELECT u.id, u.name, p.productName, COUNT(od.productId) AS orderCount
      FROM Users u
      JOIN Orders o ON u.id = o.userId
      JOIN OrderDetails od ON o.id = od.orderId
      JOIN Products p ON od.productId = p.id
      GROUP BY u.id, u.name, p.productName
      HAVING COUNT(od.productId) = (
        SELECT MAX(productCount) FROM (
          SELECT COUNT(od2.productId) AS productCount
          FROM Orders o2
          JOIN OrderDetails od2 ON o2.id = od2.orderId
          WHERE o2.userId = u.id
          GROUP BY od2.productId
        ) sub
      );
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve the most ordered product per user' });
  }
};