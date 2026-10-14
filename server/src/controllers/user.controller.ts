import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { asyncHandler } from '../utils/asyncHandler';
import type { UpdateProfileInput, ChangePasswordInput } from '../schemas/user.schemas';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getProfile(req.userId!);
  res.json({ success: true, data: user });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateProfile(req.userId!, req.body as UpdateProfileInput);
  res.json({ success: true, data: user });
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  await userService.changePassword(req.userId!, req.body as ChangePasswordInput);
  res.json({ success: true, message: 'Password updated successfully' });
});
