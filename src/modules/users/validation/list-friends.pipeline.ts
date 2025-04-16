import * as v from 'valibot';
import { Injectable } from '@nestjs/common';
import DefaultValidationPipe from '../../../libraries/validation.pipline';

@Injectable()
export default class ListFriendsValidationPipe extends DefaultValidationPipe {
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
