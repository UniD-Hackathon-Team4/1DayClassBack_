import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupPayload {
  @IsString()
  @ApiProperty({ type: String, description: '학번' })
  email!: string;

  @IsString()
  @ApiProperty({ type: String, description: '비밀번호' })
  password!: string;

  @IsString()
  @ApiProperty({ type: String, description: '닉네임' })
  nickname!: string;

  @IsString()
  @ApiProperty({ type: String, description: '연락처' })
  contact!: string;
}
