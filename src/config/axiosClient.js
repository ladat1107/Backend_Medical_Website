import axios from 'axios';
require('dotenv').config();

export const geminiAPI = axios.create({
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash',
    params: { key: process.env.GEMINI_API_KEY },
    headers: { 'Content-Type': 'application/json' },
  });


