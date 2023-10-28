import { IsOptional, IsNumberString } from 'class-validator';

export class BaseDto {
  @IsOptional()
  public userlanguage: string;

  @IsOptional()
  public accept: any;

  @IsOptional()
  public 'content-type': any;

  @IsOptional()
  public 'content-length': any;

  @IsOptional()
  public language: any;

  @IsOptional()
  public 'user-agent': any;

  @IsOptional()
  public host: any;

  @IsOptional()
  public connection: any;
}

export class BaseRequestDto<RequestDtoT> {
  anyT: RequestDtoT;
}

export class IdentityRequestDto {
  @IsNumberString()
    id: number;
}

export abstract class BaseResponseDTO<ResponseT> {
  public abstract toCreateResponseDto(payload: any): ResponseT | Promise<ResponseT>;
}
