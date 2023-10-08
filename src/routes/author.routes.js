import {Router} from 'express';
import { ctrlCreateAuthor, ctrlDeleteAuthor, ctrlFindAllAuthors, ctrlFindAuthorById, ctrlUpdateAuthor } from '../controllers/author.controller.js';

const authorRouther = Router();

authorRouther.post('/api/author', ctrlCreateAuthor)
authorRouther.get('/api/author', ctrlFindAllAuthors)
authorRouther.get('/api/author/:id', ctrlFindAuthorById)
authorRouther.put('/api/author/:id', ctrlUpdateAuthor)
authorRouther.delete('/api/author/:id', ctrlDeleteAuthor)

export {authorRouther}