import { Book, Borrowing } from '@prisma/client';
import { Request, Response } from 'express';
import { singleton } from 'tsyringe';

import {
  composeBookDto,
  composeBookListDto,
  composeBorrowingListDto
} from '../response-body-composer/responseBodyComposer';
import { BookService } from '../service/book.service';
import {
  BookCheckoutDto,
  BookDto,
  BookReturnDto,
  BookSearchQuery,
  BookUpdateDto
} from '../types/dto/book.dto';
import { bookValidator } from '../validator/book.validator';

@singleton()
export class BookController {
  constructor(private readonly bookService: BookService) {}

  async createBook(req: Request, res: Response) {
    const bookCreateDto: BookDto = req.body;
    bookValidator.validate(bookCreateDto);

    const book: Book = await this.bookService.createBook(bookCreateDto);

    res.status(201).json(composeBookDto(book));
  }

  async listBooks(req: Request, res: Response) {
    const books: Book[] = await this.bookService.listBooks();

    res.status(200).json(composeBookListDto(books));
  }

  async listOverdueBorrowings(req: Request, res: Response) {
    const borrowings: Borrowing[] = await this.bookService.listOverdueBorrowings();

    res.status(200).json(composeBorrowingListDto(borrowings));
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

  async checkoutBook(req: Request, res: Response) {
    const bookId: string = req.params.bookId;
    const bookCheckoutDto: BookCheckoutDto = req.body;

    const borrowing: Borrowing = await this.bookService.checkoutBook(bookId, bookCheckoutDto);

    res.status(200).json(borrowing);
  }

  async returnBook(req: Request, res: Response) {
    const bookId: string = req.params.bookId;
    const bookReturnDto: BookReturnDto = req.body;

    const borrowing: Borrowing = await this.bookService.returnBook(
      bookId,
      bookReturnDto.borrowerId
    );

    res.status(200).json(borrowing);
  }
}
