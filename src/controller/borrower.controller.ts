import { Book, Borrower, User } from '@prisma/client';
import { Request, Response } from 'express';
import { singleton } from 'tsyringe';

import { borrowerValidator } from '../validator/borrower.validator';
import { BorrowerCreateDto, BorrowerUpdateDto } from '../types/dto/borrower.dto';
import { BorrowerService } from '../service/borrower.service';
import {
  composeBorrowerListDto,
  composeBorrowerDto,
  composeRegisteredBorrowerDto,
  composeBookListDto
} from '../response-body-composer/responseBodyComposer';
import { UserWithBorrower } from '../types/query/user.query';

@singleton()
export class BorrowerController {
  constructor(private readonly borrowerService: BorrowerService) {}

  async createBorrower(req: Request, res: Response) {
    const borrowerCreateDto: BorrowerCreateDto = req.body;
    borrowerValidator.validate(borrowerCreateDto);

    const user: UserWithBorrower = await this.borrowerService.createBorrower(borrowerCreateDto);

    res.status(201).json(composeRegisteredBorrowerDto(user));
  }

  async listBorrowers(req: Request, res: Response) {
    const borrowers: Borrower[] = await this.borrowerService.listBorrowers();

    res.status(200).json(composeBorrowerListDto(borrowers));
  }

  async getBorrower(req: Request, res: Response) {
    const borrowerId: number = parseInt(req.params.borrowerId);

    const borrower: Borrower = await this.borrowerService.getBorrower(borrowerId);

    res.status(200).json(composeBorrowerDto(borrower));
  }

  async updateBorrower(req: Request, res: Response) {
    const borrowerId: number = parseInt(req.params.borrowerId);
    const borrowerUpdateDto: BorrowerUpdateDto = req.body;
    borrowerValidator.validate(borrowerUpdateDto);

    const borrower: Borrower = await this.borrowerService.updateBorrower(
      borrowerId,
      borrowerUpdateDto
    );

    res.status(200).json(composeBorrowerDto(borrower));
  }

  async deleteBorrower(req: Request, res: Response) {
    const borrowerId: number = parseInt(req.params.borrowerId);

    await this.borrowerService.deleteBorrower(borrowerId);

    res.sendStatus(204);
  }

  async listBorrowerBooks(req: Request, res: Response) {
    const borrowerId: number = parseInt(req.params.borrowerId);

    const books: Book[] = await this.borrowerService.listBorrowerBooks(borrowerId);

    res.status(200).json(composeBookListDto(books));
  }
}
