import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from "class-validator";

export class RequestOtpDto {
  @IsEmail()
  email!: string;
}

export class VerifyOtpDto {
  @IsEmail()
  email!: string;

  @Matches(/^\d{6}$/, { message: "OTP must be exactly 6 digits" })
  code!: string;
}

export class RegisterDto {
  @IsString()
  registrationToken!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  govPassword!: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  financialPassword?: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class StepUpDto {
  @IsString()
  financialPassword!: string;
}
