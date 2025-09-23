import { Role } from '@prisma/client'

// TODO Role should be agnostic
export const SPECIAL_ROLES: Record<string, Role> = {
  admin: 'ADMIN',
  nikita: 'NIKITA',
}
