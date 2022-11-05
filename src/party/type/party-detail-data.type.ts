import { OttType, PartyType } from '@prisma/client';

export type PartyDetailData = {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date | null;
  numOfPeople: number;
  cost: number;
  ott: OttType;
  type: PartyType;
  isCompleted: boolean;
  user: {
    id: number;
    nickname: string;
  };
  participate: ParticipateData[];
};

export type ParticipateData = {
  id: number;
  isSelected: boolean;
  user: {
    id: number;
    nickname: string;
    contact: string;
  };
};
