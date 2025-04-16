import { UserInterface } from './user.interface';

export interface FriendInterface {
  id: string;
  user_id: string;
  friend_id: string;
  user: UserInterface;
  friend: UserInterface;
  created_at: Date;
}
