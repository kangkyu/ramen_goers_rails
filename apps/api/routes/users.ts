import { User } from "@fusion/shared/types";

export type PublicUser = Pick<User, "id" | "email" | "name">;

export interface InternalUser extends User {
  passwordHash: string;
}

export const users: InternalUser[] = [];

export function addUser(data: { email: string; name: string; passwordHash: string }): InternalUser {
  const user: InternalUser = {
    id: `user${users.length + 1}`,
    email: data.email,
    name: data.name,
    passwordHash: data.passwordHash,
  };
  users.push(user);
  return user;
}

export function findUserByEmail(email: string): InternalUser | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
