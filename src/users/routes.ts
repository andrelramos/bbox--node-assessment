import { CustomRequest } from "@utils/types";
import { Request, Response, Router } from "express";
import { createUser, deleteUser, getAllUsers, getUserByUUID } from "@users/controllers";
import User, { UserRole, UserEvent } from "@src/users/models/User";

interface UserRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

const userRouter = Router();

userRouter.post(
  "/",
  async ({ body }: CustomRequest<UserRequestBody>, res: Response) => {
    const user: User = await createUser({
      "firstName": body.firstName,
      "lastName": body.lastName,
      "email": body.email,
      "phoneNumber": body.phoneNumber,
      "password": body.password,
      role: UserRole.CLIENT,
      creationDate: new Date(),
      currentEvent: UserEvent.CREATION,
    })
    res.status(201).json({ id: user.uuid });
  }
);

userRouter.get("/", async (req: Request, res: Response) => {
  const users = await getAllUsers();
  res.status(200).json(users);
});

userRouter.get("/:id", async (req: Request, res: Response) => {
  const user: User|null = await getUserByUUID(req.params.id);
  if (user) res.status(200).json(user);
  else res.status(404).json({ message: "User not found!" });
});

userRouter.delete("/:id", async (req: Request, res: Response) => {
  const result: boolean = await deleteUser(req.params.id);
  if (result) res.sendStatus(204);
  else res.status(404).json({ message: "User not found!" });
});

export default userRouter;