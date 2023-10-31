import { Book } from '@prisma/client';

import { BookDto, BookListDto } from '../types/dto/BookDto';

export const composeBookListDto = (books: Book[]): BookListDto => {
  return {
    books: books.map(composeBookDto)
  };
};

export const composeBookDto = (book: Book): BookDto => {
  const { active, ...bookDto } = book;
  return bookDto;
};
