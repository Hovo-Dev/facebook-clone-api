import * as v from 'valibot';
import { Injectable } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { FriendRequestStatusEnum } from '../../../enums/friend.enum';
import PaginationDto from '../../../libraries/pagination/pagination.dto';
import DefaultValidationPipe from '../../../libraries/validation.pipline';

export class ListRequestsPaginatedDto extends PaginationDto {
  @ApiPropertyOptional({ enum: FriendRequestStatusEnum })
  status?: FriendRequestStatusEnum;
}

@Injectable()
export default class ListRequestsValidationPipe extends DefaultValidationPipe {
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
      status: v.optional(
        v.pipe(
          v.string(),
          v.transform((input) => Number(input)),
          v.number(),
          v.enum(FriendRequestStatusEnum)
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
