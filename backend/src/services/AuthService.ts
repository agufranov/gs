import { SPECIAL_ROLES } from "@/const/specialRoles";
import { UserResponse } from "@/types";
import bcrypt from "bcrypt";
import { BaseService } from "./BaseService";

export interface SignInData {
  username: string;
  password: string;
}

export interface SignInResult {
  success: boolean;
  error?: string;
}

export class AuthService extends BaseService {
  async signIn({ username, password }: SignInData): Promise<SignInResult> {
    try {
      let user = await this.prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            username,
            passwordHash: await bcrypt.hash(password, 5),
            role: SPECIAL_ROLES[username],
          },
        });
      }

      if (!(await bcrypt.compare(password, user.passwordHash))) {
        return { success: false, error: "Wrong password" };
      }

      const session = await this.prisma.authSession.create({
        data: {
          userId: user.id,
        },
      });

      return { success: true };
    } catch (err) {
      console.error("AuthService.signIn error:", err);
      return { success: false, error: "Internal server error" };
    }
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

  async getSessionUser(sessionId: string): Promise<UserResponse | null> {
    const session = await this.prisma.authSession.findUnique({
      where: { data: sessionId },
      select: { user: { select: { id: true, username: true, role: true } } },
    });

    return session?.user || null;
  }
}
