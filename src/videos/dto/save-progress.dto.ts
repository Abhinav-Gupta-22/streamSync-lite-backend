import { IsString, IsNumber, Min, Max } from 'class-validator';

export class SaveProgressDto {
  @IsString()
  videoId: string;

  @IsNumber()
  @Min(0)
  positionSeconds: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  completedPercent: number;
}
