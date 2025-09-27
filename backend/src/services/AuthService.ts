import {
  AuthSession,
  SPECIAL_ROLES,
  SignInRequest,
  User,
  UserResponse,
} from "@gs/shared";
import bcrypt from "bcrypt";
import { BaseService } from "./BaseService";

export class AuthService extends BaseService {
  async signIn({ username, password }: SignInRequest): Promise<User> {
    let user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      user = await this.signUp({ username, password });
    }

    if (!(await bcrypt.compare(password, user.passwordHash))) {
      throw new Error("Invalid password");
    }

    return user;
  }

  async signUp({ username, password }: SignInRequest): Promise<User> {
    return await this.prisma.user.create({
      data: {
        username,
        passwordHash: await bcrypt.hash(password, 5),
        role: SPECIAL_ROLES[username],
      },
    });
  }

  async signOut(sessionId: string): Promise<void> {
    await this.prisma.authSession.delete({
      where: { data: sessionId },
    });
  }

  async getProfile(userId: number): Promise<UserResponse | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });

    return user;
  }

  async createSession(userId: number): Promise<AuthSession> {
    return await this.prisma.authSession.create({
      data: {
        userId,
      },
    });
  }

  async getSessionUser(sessionId: string): Promise<UserResponse | null> {
    const session = await this.prisma.authSession.findUnique({
      where: { data: sessionId },
      select: { user: { select: { id: true, username: true, role: true } } },
    });

    return session?.user || null;
  }
}
