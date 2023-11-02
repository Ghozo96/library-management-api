import { Borrowing } from '@prisma/client';

export type BookUpdateDto = Omit<BookDto, 'isbn'>;

export interface BookListDto {
  books: BookDto[];
}

export interface BookDto {
  isbn: string;
  title: string;
  author: string;
  availableQuantity: number;
  shelfLocation: number;
}

export interface BookSearchQuery {
  isbn?: string;
  title?: string;
  author?: string;
}

export interface BookCheckoutDto {
  borrowerId: number;
  daysToBorrow: number;
}

export interface BookReturnDto {
  borrowerId: number;
}

export interface BorrowingListDto {
  borrowings: Borrowing[];
}
