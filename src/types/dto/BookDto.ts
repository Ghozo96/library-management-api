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
