import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { UserInterface } from '../interfaces/user.interface';

@Injectable()
export class UserRepository  {
  constructor(
    private readonly dbService: DatabaseService
  ) {}

  /**
   * Find a user by email.
   *
   * @param email - The email to search.
   */
  async findByEmail(email: string): Promise<UserInterface | null> {
    const sql = `SELECT * FROM users WHERE email = $1 LIMIT 1`;
    const result = await this.dbService.query(sql, [email]);

    return result.length ? result[0] : null;
  }

  /**
   * Create user in the database.
   *
   * @param user - The user to create.
   */
  async createUser(user: Partial<UserInterface>): Promise<UserInterface> {
    const sql = `INSERT INTO users (email, first_name, last_name, password, age) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const result = await this.dbService.query(sql, Object.values(user));

    return result[0];
  }

  /**
   * Find users with filtering and pagination
   *
   * @param options - Options for filtering and pagination
   * @returns A paginated list of friend requests with user details
   */
  async searchUsersPaginated(options: {
    first_name?: string;
    last_name?: string;
    age?: number;
    email?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { first_name, last_name, age, email, page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const whereClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (first_name) {
      whereClauses.push(`first_name ILIKE $${paramIndex++}`);
      values.push(`%${first_name}%`);
    }

    if (last_name) {
      whereClauses.push(`last_name ILIKE $${paramIndex++}`);
      values.push(`%${last_name}%`);
    }

    if (age) {
      whereClauses.push(`CAST(age AS TEXT) ILIKE $${paramIndex++}`);
      values.push(`%${age}%`);
    }

    if (email) {
      whereClauses.push(`email ILIKE $${paramIndex++}`);
      values.push(`%${email}%`);
    }

    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const sql = `
      SELECT * FROM users
      ${whereSQL}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex}
    `;
    values.push(limit, offset);

    const data = await this.dbService.query(sql, values);

    const countSql = `SELECT COUNT(*) FROM users ${whereSQL}`;
    const countResult = await this.dbService.query(countSql, values.slice(0, paramIndex - 2));
    const total = parseInt(countResult[0].count, 10);

    return {
      data,
      total,
      page,
      limit
    };
  }

  /**
   * Find a user by a specific field.
   *
   * @param field - The field to search by.
   * @param value - The value to search for.
   */
  async findOne(field: keyof UserInterface, value: any): Promise<UserInterface | null> {
    const sql = `SELECT * FROM users WHERE ${field} = $1 LIMIT 1`;
    const result = await this.dbService.query(sql, [value]);

    return result.length ? result[0] : null;
  }

  /**
   * Checks a user exists or not by field
   *
   * @param field - The field to check.
   */
  async exists(field: keyof UserInterface, value: any): Promise<boolean> {
    const sql = `SELECT 1 FROM users WHERE ${field} = $1 LIMIT 1`;
    const result = await this.dbService.query(sql, [value]);

    return result.length > 0;
  }
}
