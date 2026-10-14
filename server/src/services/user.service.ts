import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';
import type { UpdateProfileInput, ChangePasswordInput } from '../schemas/user.schemas';

function sanitizeUser(user: {
  id: number; name: string; email: string;
  currency: string; createdAt: Date; updatedAt: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    currency: user.currency,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function getProfile(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound('User not found');
  return sanitizeUser(user);
}

export async function updateProfile(userId: number, input: UpdateProfileInput) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { ...(input.name ? { name: input.name } : {}), ...(input.currency ? { currency: input.currency } : {}) },
  });
  return sanitizeUser(user);
}

export async function changePassword(userId: number, input: ChangePasswordInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound('User not found');

  const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
  if (!valid) throw ApiError.badRequest('Current password is incorrect');

  const newHash = await bcrypt.hash(input.newPassword, env.BCRYPT_ROUNDS);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash } });
}
