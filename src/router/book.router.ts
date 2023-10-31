import { Router } from 'express';

import { BookController } from '../controller/book.controller';
import { diContainer } from '../diContainer';

const router = Router();
const bookController = diContainer.resolve(BookController);

router.post('/', bookController.createBook.bind(bookController));
router.get('/', bookController.listBooks.bind(bookController));
router.get('/search', bookController.searchBooks.bind(bookController));
router.get('/:bookId', bookController.getBook.bind(bookController));
router.put('/:bookId', bookController.updateBook.bind(bookController));
router.delete('/:bookId', bookController.deleteBook.bind(bookController));

export const bookRouter = router;
