/*
Controller for User CRUD Operations
This file handles the CRUD operations for users using SQL queries.
*/

import sql from 'mssql';
import { config } from '../config/dbConfig.js';

// Connect to SQL Server - this method will be reused in each operation to ensure a connection is established into the database
const connectToSQL = async () => {//async to make sure it doesn't crash
  try {
    await sql.connect(config);
    
    sql.on('error', err => {
      console.error('SQL Error: ', err);
    });

  } catch (err) {
    console.error('Error connecting to SQL Server: ', err);  // Log the full error details
    throw new Error('Error connecting to SQL Server:', err);
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    await connectToSQL();
    const result = await sql.query('SELECT * FROM Users');
    // console.log('SQL Query Result:', result);
    res.json(result.recordset); // Return the result set, it is like an array of JSON objects}
  } catch (err) {
    console.error('Error retrieving users:', err);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  // console.log('Request Body:', req.body);
  const { name, age } = req.body;

  // Convert age to a number
  const ageNumber = Number(age);

  // Basic validation
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing name' });
  }
  if (!age || isNaN(ageNumber)) {
    return res.status(400).json({ error: 'Invalid or missing age' });
  }

  try {
    await connectToSQL();
    await sql.query(`INSERT INTO Users (name, age) VALUES ('${name}', ${age})`);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;

  try {
    await connectToSQL();
    const result = await sql.query(`UPDATE Users SET name = 
      '${name}', age = ${age} WHERE id = ${id}`);
    if (result.rowsAffected[0] === 0) {//expecting 1 row to be affected because we are updating one user-
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Patch (Partial Update) a user
export const patchUser = async (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;

  try {
    await connectToSQL();

    // First, retrieve the current user data to keep unchanged fields
    const currentUserResult = await sql.query(`SELECT * FROM Users WHERE id = ${id}`);
    const currentUser = currentUserResult.recordset[0];

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If no name is provided, use the existing name from the current user
    const updatedName = name !== undefined ? name : currentUser.name;

    // If no age is provided, use the existing age from the current user
    const updatedAge = age !== undefined ? Number(age) : currentUser.age;

    // Check if the provided age is a valid number
    if (age !== undefined && isNaN(updatedAge)) {
      return res.status(400).json({ error: 'Invalid age provided' });
    }

    // Perform the update with the provided or existing values
    const result = await sql.query(
      `UPDATE Users SET name = '${updatedName}', age = ${updatedAge} WHERE id = ${id}`
    );

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User patched successfully' });
  } catch (err) {
    console.error('Error patching user:', err);
    res.status(500).json({ error: 'Failed to patch user' });
  }
};



// Delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await connectToSQL();
    const result = await sql.query(`DELETE FROM Users WHERE id = ${id}`);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
