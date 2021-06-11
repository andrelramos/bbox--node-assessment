import { v4 as uuidv4 } from "uuid";
import User, {UserRole, UserEvent} from "@src/users/models/User";

interface userData {
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  password: string,
  role: UserRole,
  creationDate: Date,
  currentEvent: UserEvent,
}

export async function createUser(userData: userData): Promise<User> {
  const uuid = uuidv4();
  const user: User = User.create({uuid, ...userData});
  return await user.save();
}

export async function getAllUsers(): Promise<User[]> {
  return await User.find();
}

export async function getUserByUUID(userUUID: string): Promise<User|null> {
  return await User.findOne({ uuid: userUUID });
}

export async function deleteUser(userUUID: string): Promise<boolean> {
  const user: User|null = await getUserByUUID(userUUID);
  if (user) {
    await User.delete(user);
    return true;
  }

  return false;
}