export interface BorrowerCreateDto {
  email: string;
  password: string;
  name: string;
  age: number;
}

export interface BorrowerUpdateDto {
  name: string;
  age: number;
}

export type RegisteredBorrowerDto = BorrowerDto & {
  email: string;
};

export type BorrowerListDto = {
  borrowers: BorrowerDto[];
};

export interface BorrowerDto {
  id: number;
  name: string;
  age: number;
  lastBorrowedDate: string | null;
  userId: number;
}
