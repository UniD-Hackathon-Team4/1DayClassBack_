import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginPayload {
  @IsString()
  @ApiProperty({ type: String, description: '이메일' })
  email!: string;

  @IsString()
  @ApiProperty({ type: String, description: '비밀번호' })
  password!: string;
}
