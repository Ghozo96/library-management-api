import { Book, Borrower, PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { inject, singleton } from 'tsyringe';

import { DiContainerTokens } from '../diContainer';
import BadRequestError from '../error/http/BadRequestError';
import { BorrowerErrorMessages } from '../error/messages/BorrowerErrorMessages';
import { BorrowerCreateDto, BorrowerUpdateDto } from '../types/dto/borrower.dto';
import { UserWithBorrower } from '../types/query/user.query';
import NotFoundError from '../error/http/NotFoundError';

@singleton()
export class BorrowerService {
  constructor(@inject(DiContainerTokens.PrismaClient) private readonly prisma: PrismaClient) {}

  async createBorrower({
    email,
    password,
    name,
    age
  }: BorrowerCreateDto): Promise<UserWithBorrower> {
    try {
      const hashedPasword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPasword,
          role: Role.BORROWER,
          borrower: {
            create: { name, age }
          }
        },
        include: {
          borrower: true
        }
      });
      return user;
    } catch (error: unknown) {
      console.error(error);
      throw new BadRequestError(BorrowerErrorMessages.CreateFailed);
    }
  }

  async listBorrowers(): Promise<Borrower[]> {
    return this.prisma.borrower.findMany({
      where: {
        user: {
          active: true
        }
      }
    });
  }

  async getBorrower(borrowerId: number): Promise<Borrower> {
    const borrower: Borrower | null = await this.prisma.borrower.findUnique({
      where: {
        id: borrowerId,
        user: {
          active: true
        }
      }
    });
    if (!borrower) {
      throw new NotFoundError(BorrowerErrorMessages.NotFound);
    }
    return borrower;
  }

  async updateBorrower(borrowerId: number, borrowerDto: BorrowerUpdateDto): Promise<Borrower> {
    try {
      const borrower = await this.prisma.borrower.update({
        where: { id: borrowerId },
        data: { ...borrowerDto }
      });
      return borrower;
    } catch (error: unknown) {
      console.error(error);
      throw new BadRequestError(BorrowerErrorMessages.CreateFailed);
    }
  }

  async deleteBorrower(borrowerId: number): Promise<void> {
    try {
      await this.prisma.borrower.update({
        where: { id: borrowerId },
        data: {
          user: {
            update: {
              active: false
            }
          }
        }
      });
    } catch (error: unknown) {
      console.error(error);
      throw new BadRequestError(BorrowerErrorMessages.DeleteFailed);
    }
  }

  async listBorrowerBooks(borrowerId: number): Promise<Book[]> {
    return this.prisma.book.findMany({
      where: {
        borrowing: {
          some: {
            borrowerId
          }
        }
      }
    });
  }
}
