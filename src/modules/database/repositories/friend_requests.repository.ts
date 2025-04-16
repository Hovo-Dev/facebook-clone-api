import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { FriendRequestStatusEnum } from '../../../enums/friend.enum';
import { UserInterface } from '../interfaces/user.interface';

@Injectable()
export class FriendRequestsRepository {
  constructor(private readonly dbService: DatabaseService) {}


  /**
   * Create a new friend request in the database.
   *
   * @param requesterId - The ID of the user sending the friend request
   * @param recipientId - The ID of the user receiving the friend request
   * @param status - The status of the friend request (default is Pending)
   */
  async insert(requesterId: string, recipientId: string, status =  FriendRequestStatusEnum.Pending): Promise<any> {
    const sql = `
      INSERT INTO friend_requests (requester_id, recipient_id, status)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await this.dbService.query(sql, [requesterId, recipientId, status]);

    return result[0];
  }

  /**
   * Insert a new friend request into the database.
   *
   * @param requestId - The ID of the friend request
   * @param recipientId - The ID of the recipient
   * @param status - The status of the friend request (default is Pending)
   */
  async findRequests(requestId: string, recipientId: string, status = FriendRequestStatusEnum.Pending): Promise<any | null> {
    const sql = `
      SELECT * FROM friend_requests 
      WHERE id = $1 AND recipient_id = $2 AND status = $3
      LIMIT 1
    `;
    const result = await this.dbService.query(sql, [requestId, recipientId, status]);

    return result.length ? result[0] : null;
  }

  /**
   * Update the status of a friend request in the database.
   *
   * @param requestId - The ID of the friend request
   * @param status - The new status of the friend request
   */
  async updateRequestStatus(requestId: string, status: FriendRequestStatusEnum): Promise<any> {
    const sql = `
      UPDATE friend_requests 
      SET status = $1 
      WHERE id = $2
      RETURNING *
    `;

    const result = await this.dbService.query(sql,  [status, requestId]);

    return result.length ? result[0] : null;
  }

  /**
   * Find incoming friend requests with user details.
   *
   * @param options - Options for filtering and pagination
   * @returns A paginated list of friend requests with user details
   */
  async findRequestsWithUsersPaginated(options: {
    recipient_id: string;
    status?: FriendRequestStatusEnum
    page: number | undefined;
    limit: number | undefined;
  }): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { recipient_id, status, page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit

    const values: any = [recipient_id];
    let paramIndex = 2;

    let whereClause = `WHERE fr.recipient_id = $1`;

    if (status) {
      values.push(status);
      whereClause += ` AND fr.status = $${paramIndex++}`;
    }

    // Main query
    const sql = `
      SELECT 
        fr.*,
        requester.id AS requester_id,
        requester.first_name AS requester_first_name,
        requester.last_name AS requester_last_name,
        requester.email AS requester_email,
        recipient.id AS recipient_id,
        recipient.first_name AS recipient_first_name,
        recipient.last_name AS recipient_last_name,
        recipient.email AS recipient_email
      FROM friend_requests fr
      LEFT JOIN users requester ON fr.requester_id = requester.id
      LEFT JOIN users recipient ON fr.recipient_id = recipient.id
      ${whereClause}
      ORDER BY fr.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex}
    `;

    values.push(limit, offset);

    const data = await this.dbService.query(sql, values);

    // Count query (without pagination)
    const countSql = `
      SELECT COUNT(*) FROM friend_requests fr
      ${whereClause}
    `;
    const countResult = await this.dbService.query(countSql, values.slice(0, paramIndex - 2));
    const total = parseInt(countResult[0].count, 10);

    return {
      data: data.map(row => ({
        ...row,
        requester: {
          id: row.requester_id,
          firstName: row.requester_first_name,
          lastName: row.requester_last_name,
          email: row.requester_email
        },
        recipient: {
          id: row.recipient_id,
          firstName: row.recipient_first_name,
          lastName: row.recipient_last_name,
          email: row.recipient_email
        }
      })),
      total,
      page,
      limit
    };
  }

  /**
   * Find a request by a specific field.
   *
   * @param field - The field to search by.
   * @param value - The value to search for.
   */
  async findOne(field: keyof UserInterface, value: any): Promise<UserInterface | null> {
    const sql = `SELECT * FROM friend_requests WHERE ${field} = $1 LIMIT 1`;
    const result = await this.dbService.query(sql, [value]);

    return result.length ? result[0] : null;
  }
}
