import { Book, PrismaClient } from '@prisma/client';
import { inject, singleton } from 'tsyringe';

import { DiContainerTokens } from '../diContainer';
import BadRequestError from '../error/http/BadRequestError';
import NotFoundError from '../error/http/NotFoundError';
import { BookErrorMessages } from '../error/messages/BookErrorMessages';
import { BookDto, BookSearchQuery, BookUpdateDto } from '../types/dto/BookDto';

@singleton()
export class BookService {
  constructor(@inject(DiContainerTokens.PrismaClient) private readonly prisma: PrismaClient) {}

  async createBook(bookDto: BookDto): Promise<Book> {
    try {
      const book: Book = await this.prisma.book.create({
        data: { ...bookDto }
      });
      return book;
    } catch (error: unknown) {
      console.error(error);
      throw new BadRequestError(BookErrorMessages.CreateFailed);
    }
  }

  async listBooks(): Promise<Book[]> {
    return this.prisma.book.findMany({
      where: { active: true }
    });
  }

  async searchBooks(searchQuery: BookSearchQuery): Promise<Book[]> {
    return this.prisma.book.findMany({
      where: { ...searchQuery, active: true }
    });
  }

  async getBook(bookId: string): Promise<Book> {
    const book: Book | null = await this.prisma.book.findUnique({
      where: { isbn: bookId, active: true }
    });
    if (!book) {
      throw new NotFoundError(BookErrorMessages.NotFound);
    }
    return book;
  }

  async updateBook(bookId: string, bookDto: BookUpdateDto): Promise<Book> {
    try {
      const book: Book = await this.prisma.book.update({
        where: { isbn: bookId },
        data: { ...bookDto }
      });
      return book;
    } catch (error: unknown) {
      console.error(error);
      throw new BadRequestError(BookErrorMessages.UpdateFailed);
    }
  }

  async deleteBook(bookId: string): Promise<void> {
    try {
      await this.prisma.book.update({
        where: { isbn: bookId },
        data: { active: false }
      });
    } catch (error: unknown) {
      console.error(error);
      throw new BadRequestError(BookErrorMessages.DeleteFailed);
    }
  }
}
