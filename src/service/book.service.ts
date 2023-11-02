import { Book, Borrowing, PrismaClient } from '@prisma/client';
import { inject, singleton } from 'tsyringe';

import { DiContainerTokens } from '../diContainer';
import BadRequestError from '../error/http/BadRequestError';
import NotFoundError from '../error/http/NotFoundError';
import { BookErrorMessages } from '../error/messages/BookErrorMessages';
import { BookCheckoutDto, BookDto, BookSearchQuery, BookUpdateDto } from '../types/dto/book.dto';

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

  async listOverdueBorrowings(): Promise<Borrowing[]> {
    return this.prisma.borrowing.findMany({
      where: {
        dueDate: {
          lt: new Date()
        },
        returnedDate: null
      }
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

  async checkoutBook(bookId: string, bookCheckoutDto: BookCheckoutDto): Promise<Borrowing> {
    const { borrowerId, daysToBorrow } = bookCheckoutDto;
    try {
      const book = await this.getBook(bookId);
      await this.checkOngoingBorrowing(bookId, borrowerId);
      this.checkBookAvailability(book);
      const borrowing = await this.createBorrowing(bookId, borrowerId, daysToBorrow);
      await this.decrementBookQuantity(book);
      return borrowing;
    } catch (error: unknown) {
      console.error(error);
      throw new BadRequestError(BookErrorMessages.CheckoutFailed);
    }
  }

  private checkBookAvailability(book: Book): void {
    if (book.availableQuantity === 0) {
      throw new BadRequestError(BookErrorMessages.Unavailable);
    }
  }

  private async checkOngoingBorrowing(bookId: string, borrowerId: number): Promise<void> {
    const borrowing: Borrowing | null = await this.prisma.borrowing.findFirst({
      where: {
        bookId,
        borrowerId,
        returnedDate: null
      }
    });
    if (borrowing) {
      throw new BadRequestError(BookErrorMessages.AlreadyBorrowed);
    }
  }

  private async createBorrowing(
    bookId: string,
    borrowerId: number,
    daysToBorrow: number
  ): Promise<Borrowing> {
    const checkedOutDate = new Date();
    const dueDate = new Date(checkedOutDate);
    dueDate.setDate(checkedOutDate.getDate() + daysToBorrow);
    return this.prisma.borrowing.create({
      data: {
        bookId,
        borrowerId,
        checkedOutDate,
        dueDate
      }
    });
  }

  private async decrementBookQuantity(book: Book): Promise<Book> {
    return this.prisma.book.update({
      where: { isbn: book.isbn },
      data: { availableQuantity: book.availableQuantity - 1 }
    });
  }

  async returnBook(bookId: string, borrowerId: number): Promise<Borrowing> {
    try {
      const borrowing: Borrowing = await this.getOngoingBorrowing(bookId, borrowerId);
      const updatedBorrowing: Borrowing = await this.updateBorrowingReturnDate(borrowing);
      const book = await this.getBook(bookId);
      await this.incrementBookQuantity(book);
      return updatedBorrowing;
    } catch (error: unknown) {
      console.error(error);
      throw new BadRequestError(BookErrorMessages.ReturnFailed);
    }
  }

  private async getOngoingBorrowing(bookId: string, borrowerId: number): Promise<Borrowing> {
    const borrowing: Borrowing | null = await this.prisma.borrowing.findFirst({
      where: {
        bookId,
        borrowerId,
        returnedDate: null
      }
    });
    if (!borrowing) {
      throw new NotFoundError(BookErrorMessages.BorrowingNotFound);
    }
    return borrowing;
  }

  private async updateBorrowingReturnDate(borrowing: Borrowing): Promise<Borrowing> {
    return this.prisma.borrowing.update({
      where: { id: borrowing.id },
      data: { returnedDate: new Date() }
    });
  }

  private async incrementBookQuantity(book: Book): Promise<Book> {
    return this.prisma.book.update({
      where: { isbn: book.isbn },
      data: { availableQuantity: book.availableQuantity + 1 }
    });
  }
}
