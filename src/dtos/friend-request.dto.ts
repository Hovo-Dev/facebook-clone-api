import { UserDTO } from './user.dto';
import { FriendRequestStatusEnum } from '../enums/friend.enum';
import { FriendRequestsInterface } from '../modules/database/interfaces/friend_requests.interface';

export class FriendRequestDTO {
  id: string
  status: FriendRequestStatusEnum
  requester: UserDTO
  recipient: UserDTO

  constructor(data: FriendRequestsInterface) {
    this.id = data.id
    this.status = data.status
    this.requester = new UserDTO(data.requester)
    this.recipient = new UserDTO(data.recipient)
  }
}
