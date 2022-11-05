import { OttType, PartyType } from '@prisma/client';

export type PartyCreateData = {
  type: PartyType;
  ott: OttType;
  title: string;
  startDate: Date;
  endDate?: Date;
  numOfPeople: number;
  cost: number;
};
