import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { FriendInterface } from '../interfaces/friend.interface';
import { FriendRequestStatusEnum } from '../../../enums/friend.enum';

@Injectable()
export class FriendRepository {
  constructor(private readonly dbService: DatabaseService) {}

  /**
   * Create a friend
   *
   * @param userId - The user id who accepts friend request
   * @param friendId - The requester friend id
   */
  async insert(userId: string, friendId: string): Promise<FriendInterface> {
    const sql = `
      INSERT INTO friends (user_id, friend_id)
      VALUES ($1, $2)
    `;
    const result = await this.dbService.query(sql, [userId, friendId]);

    return result[0]
  }

  /**
   * Find friends with related user data
   *
   * @param options - Options for filtering and pagination
   * @returns A paginated list of friend requests with user details
   */
  async findFriendsPaginated(options: {
    user_id: string;
    page: number | undefined;
    limit: number | undefined;
  }): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { user_id, page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit

    let whereClause = `WHERE f.user_id = $1 OR f.friend_id = $1`;

    // Main query
    const sql = `
      SELECT 
        f.*,
        u.id AS friend_id,
        u.first_name AS friend_first_name,
        u.last_name AS friend_last_name,
        u.email AS friend_email,

        uf.id AS user_id,
        uf.first_name AS user_first_name,
        uf.last_name AS user_last_name,
        uf.email AS user_email
      FROM friends f
      LEFT JOIN users u on f.user_id = u.id
      LEFT JOIN users uf on f.friend_id = uf.id
      ${whereClause}
      ORDER BY f.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const rows = await this.dbService.query(sql, [user_id, limit, offset]);

    // Count query (without pagination)
    const countSql = `
      SELECT COUNT(*) FROM friends f
      ${whereClause}
    `;
    const countResult = await this.dbService.query(countSql, [user_id]);
    const total = parseInt(countResult[0].count, 10);

    return {
      data: rows.map(row => ({
        id: row.id,
        createdAt: row.created_at,
        friend: {
          id: row.friend_id,
          firstName: row.friend_first_name,
          lastName: row.friend_last_name,
          email: row.friend_email
        },
        user: {
          id: row.user_id,
          firstName: row.user_first_name,
          lastName: row.user_last_name,
          email: row.user_email
        }
      })),
      total,
      page,
      limit
    };
  }
}
