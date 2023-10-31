import { Book } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { singleton } from 'tsyringe';

import { composeBookDto, composeBookListDto } from '../response-body-composer/responseBodyComposer';
import { BookService } from '../service/book.service';
import { BookDto, BookSearchQuery, BookUpdateDto } from '../types/dto/BookDto';
import { bookValidator } from '../validator/book.validator';

@singleton()
export class BookController {
  constructor(private readonly bookService: BookService) {}

  async createBook(req: Request, res: Response, next: NextFunction) {
    const bookCreateDto: BookDto = req.body;
    bookValidator.validate(bookCreateDto);

    const book: Book = await this.bookService.createBook(bookCreateDto);

    res.status(201).json(composeBookDto(book));
  }

  async listBooks(req: Request, res: Response) {
    const books: Book[] = await this.bookService.listBooks();

    res.status(200).json(composeBookListDto(books));
  }

  async getBook(req: Request, res: Response) {
    const bookId: string = req.params.bookId;

    const book: Book = await this.bookService.getBook(bookId);

    res.status(200).json(composeBookDto(book));
  }

  async searchBooks(req: Request, res: Response) {
    const searchQuery: BookSearchQuery = req.query;

    const books: Book[] = await this.bookService.searchBooks(searchQuery);

    res.status(200).json(composeBookListDto(books));
  }

  async updateBook(req: Request, res: Response) {
    const bookId: string = req.params.bookId;
    const bookDto: BookUpdateDto = req.body;
    bookValidator.validate(bookDto);

    const book: Book = await this.bookService.updateBook(bookId, bookDto);

    res.status(200).json(composeBookDto(book));
  }

  async deleteBook(req: Request, res: Response) {
    const bookId: string = req.params.bookId;

    await this.bookService.deleteBook(bookId);

    res.sendStatus(204);
  }
}
