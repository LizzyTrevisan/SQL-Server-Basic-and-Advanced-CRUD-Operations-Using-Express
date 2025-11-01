/*
Routes for User APIs
This file defines the routes for the user-related operations.
*/

import express from 'express';
import { getUsers, createUser, updateUser, patchUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

// Define routes
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);//'/users/:id' to specify which user to update is the parameter to send the info
router.patch('/users/:id', patchUser);
router.delete('/users/:id', deleteUser);

export default router;
