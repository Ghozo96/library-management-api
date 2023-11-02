import { PrismaClient } from '@prisma/client';
import { container } from 'tsyringe';

export enum DiContainerTokens {
  PrismaClient = 'PrismaClient'
}

container.register(DiContainerTokens.PrismaClient, {
  useValue: new PrismaClient()
});

export const diContainer = container;
