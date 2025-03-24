import { Response, Request } from "express";
export const logoutController = (_req: Request, res: Response) => {
  try {
    res.clearCookie("jwt"); // Clear the access token cookie
    res.clearCookie("refreshJwt"); // Clear the refresh token cookie
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "internel server error when loggin" });
  }
};
