import {UserInterface} from "./user.interface";

export interface AuthTokenInterface {
  id: string;
  user_id: string;
  expires_at: Date;
  created_at: Date;
  user: UserInterface;
  bearer?: string;
}
