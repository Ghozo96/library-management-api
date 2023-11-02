import { Router } from 'express';

import { diContainer } from '../diContainer';
import { BorrowerController } from '../controller/borrower.controller';

const router = Router();
const borrowerController = diContainer.resolve(BorrowerController);

router.post('/register', borrowerController.createBorrower.bind(borrowerController));
router.get('/', borrowerController.listBorrowers.bind(borrowerController));
router.get('/:borrowerId', borrowerController.getBorrower.bind(borrowerController));
router.put('/:borrowerId', borrowerController.updateBorrower.bind(borrowerController));
router.delete('/:borrowerId', borrowerController.deleteBorrower.bind(borrowerController));
router.get('/:borrowerId/books', borrowerController.listBorrowerBooks.bind(borrowerController));

export const borrowerRouter = router;
