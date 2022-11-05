import { ApiProperty } from '@nestjs/swagger';
import { ParticipateData } from '../type/party-detail-data.type';

export class ParticipantDto {
  @ApiProperty({ type: Number })
  id!: number;

  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: Boolean })
  isSelected!: boolean;

  @ApiProperty({ type: String })
  contact!: string;

  static of(participant: ParticipateData): ParticipantDto {
    return {
      id: participant.user.id,
      name: participant.user.nickname,
      isSelected: participant.isSelected,
      contact: participant.user.contact,
    };
  }
}
