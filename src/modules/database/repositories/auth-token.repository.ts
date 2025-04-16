import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { AuthTokenInterface } from '../interfaces/auth-token.interface';

@Injectable()
export class AuthTokenRepository  {
  constructor(
    private readonly dbService: DatabaseService
  ) {}

  /**
   * Create auth token in the database.
   *
   * @param token - The token to create.
   */
  async createToken(token: Partial<AuthTokenInterface>): Promise<AuthTokenInterface> {
    const sql = `INSERT INTO auth_tokens (id, user_id, expires_at) VALUES ($1, $2, $3) RETURNING *`;
    const result = await this.dbService.query(sql, [token.id, token.user_id, token.expires_at]);

    return result[0];
  }

  /**
   * Delete token by ID.
   *
   * @param tokenId - The token ID to delete with.
   */
  async delete(tokenId: string): Promise<void> {
    const sql = `DELETE FROM auth_tokens WHERE id = $1`;
    await this.dbService.query(sql, [tokenId]);
  }

  /**
   * Find token with related user by Token ID.
   *
   * @param tokenId - The token ID to find with.
   */
  async findUserRelated(tokenId: string): Promise<AuthTokenInterface | null> {
    const sql = `
      SELECT 
        t.*, 
        u.id as user_id, 
        u.first_name as user_first_name, 
        u.last_name as user_last_name, 
        u.email as user_email
      FROM auth_tokens t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.id = $1
      LIMIT 1
    `;

    const result = await this.dbService.query(sql, [tokenId]);

    if (!result.length) return null;

    const row = result[0];

    return {
      ...row,
      user: {
        id: row.user_id,
        firstName: row.user_first_name,
        lastName: row.user_last_name,
        email: row.user_email,
      }
    };
  }
}
