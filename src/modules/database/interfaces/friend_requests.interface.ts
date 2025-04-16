import { UserInterface } from './user.interface';
import { FriendRequestStatusEnum } from '../../../enums/friend.enum';

export interface FriendRequestsInterface {
  id: string;
  requester_id: string;
  recipient_id: string;
  requester: UserInterface;
  recipient: UserInterface;
  status: FriendRequestStatusEnum;
  created_at: Date;
}
