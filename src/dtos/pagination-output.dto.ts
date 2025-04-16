import { PaginatedResult } from '../modules/database/interfaces/pagination.interface';

export class PaginationDTO<T> {
  data: T[]
  page: number
  limit: number
  total: number

  constructor(response: PaginatedResult<T>, DTO: new (item: T) => any) {
    this.data = response.data.map((item) => new DTO(item))
    this.page = Number(response.page)
    this.limit = Number(response.limit)
    this.total = Number(response.total)
  }
}
