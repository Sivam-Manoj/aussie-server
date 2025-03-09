import { Response, Request } from 'express';
export const logoutController = (_req: Request, res: Response) => {
  res.clearCookie('jwt'); // Clear the access token cookie
  res.clearCookie('refreshJwt'); // Clear the refresh token cookie
  return res.status(200).json({ message: 'Logged out successfully' });
};
