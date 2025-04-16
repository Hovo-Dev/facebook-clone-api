import * as v from 'valibot';
import { Injectable } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import PaginationDto from '../../../libraries/pagination/pagination.dto';
import DefaultValidationPipe from "../../../libraries/validation.pipline";

export class UsersSearchPaginatedDto extends PaginationDto {
  @ApiPropertyOptional()
  first_name: string;

  @ApiPropertyOptional()
  last_name: string;

  @ApiPropertyOptional()
  email: string;

  @ApiPropertyOptional()
  age: number;
}

@Injectable()
export default class UsersSearchValidationPipe extends DefaultValidationPipe {
  constructor() {
    super();
  }

  /**
   * Return schema rules for validation.
   *
   * @protected
   */
  protected rules() {
    return v.object({
      first_name: v.optional(
        v.pipe(
          v.string(),
          v.trim(),
        )
      ),
      last_name: v.optional(
        v.pipe(
          v.string(),
          v.trim(),
        )
      ),
      email: v.optional(
        v.pipe(
          v.string(),
          v.trim(),
        )
      ),
      age: v.optional(
        v.pipe(
          v.string(),
          v.transform((input) => Number(input)),
          v.minValue(18),
          v.maxValue(80),
        )
      ),
      page: v.optional(
        v.pipe(
          v.string(),
          v.transform((input) => Number(input)),
          v.number(),
        ),
      ),
      limit: v.optional(
        v.pipe(
          v.string(),
          v.transform((input) => Number(input)),
          v.maxValue(100),
        ),
      ),
    });
  }
}
