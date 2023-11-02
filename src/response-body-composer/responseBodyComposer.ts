import { Book, Borrower, Borrowing } from '@prisma/client';

import { BookDto, BookListDto, BorrowingListDto } from '../types/dto/book.dto';
import { UserWithBorrower } from '../types/query/user.query';
import { BorrowerDto, BorrowerListDto, RegisteredBorrowerDto } from '../types/dto/borrower.dto';

export const composeBookListDto = (books: Book[]): BookListDto => {
  return {
    books: books.map(composeBookDto)
  };
};

export const composeBookDto = (book: Book): BookDto => {
  const { active, ...bookDto } = book;
  return bookDto;
};

export const composeRegisteredBorrowerDto = (user: UserWithBorrower): RegisteredBorrowerDto => {
  const borrower: Borrower = user.borrower!;
  const lastBorrowedDate = borrower.lastBorrowedDate;
  return {
    id: borrower.id,
    email: user.email,
    name: borrower.name,
    age: borrower.age,
    lastBorrowedDate: lastBorrowedDate ? lastBorrowedDate.toDateString() : null,
    userId: user.id
  };
};

export const composeBorrowerListDto = (borrowers: Borrower[]): BorrowerListDto => {
  return {
    borrowers: borrowers.map(composeBorrowerDto)
  };
};

export const composeBorrowerDto = (borrower: Borrower): BorrowerDto => {
  const lastBorrowedDate = borrower.lastBorrowedDate;
  return {
    id: borrower.id,
    name: borrower.name,
    age: borrower.age,
    lastBorrowedDate: lastBorrowedDate ? lastBorrowedDate.toDateString() : null,
    userId: borrower.userId
  };
};

export const composeBorrowingListDto = (borrowings: Borrowing[]): BorrowingListDto => {
  return { borrowings };
};
