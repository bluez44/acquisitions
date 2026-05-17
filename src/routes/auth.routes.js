import { signup } from '#controllers/auth.controller.js';
import express from 'express';

const authRoutes = express.Router();

authRoutes.post('/login', (req, res) => {
  
  res.send('POST /auth/login');
});

authRoutes.post('/signup', signup);

authRoutes.post('/signout', (req, res) => {
  res.send('POST /auth/signout');
});

export default authRoutes;