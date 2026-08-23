import { IsOptional, IsString, MaxLength } from "class-validator";
import { IsBigInt } from "../is-bigint.decorator";

export class CreateTransferDto {
  @IsString()
  @MaxLength(120)
  idempotencyKey!: string;

  /** ARTH minor units as a string (JSON-safe bigint). */
  @IsBigInt()
  amountMinor!: string;

  @IsString()
  fromLedgerAccountId!: string;

  @IsString()
  toLedgerAccountId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(140)
  reference?: string;
}

export class ReverseDto {
  @IsString()
  @MaxLength(120)
  idempotencyKey!: string;
}
