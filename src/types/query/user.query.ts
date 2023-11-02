import { Borrower, User } from '@prisma/client';

export type UserWithBorrower = User & {
  borrower: Borrower | null;
};
