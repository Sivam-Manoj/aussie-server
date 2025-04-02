import { Response, Request } from "express";

export const logoutController = (req: Request, res: Response) => {
  try {
    // Set the JWT cookie to an empty value with an expired date
    res.cookie("jwt", "", {
      domain: "aussierulespro.com", // Same domain as when the cookie was set
      path: "/", // Same path as when the cookie was set
      sameSite: "none",
      secure: process.env.NODE_ENV === "production", // Ensures secure flag is honored in production
      expires: new Date(0), // Expire the cookie immediately
    });

    // Set the refreshJwt cookie to an empty value with an expired date
    res.cookie("refreshJwt", "", {
      domain: "aussierulespro.com", // Same domain as when the cookie was set
      path: "/", // Same path as when the cookie was set
      sameSite: "none",
      secure: process.env.NODE_ENV === "production", // Ensures secure flag is honored in production
      expires: new Date(0), // Expire the cookie immediately
    });

    // Send a response indicating successful logout
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error while logging out" });
  }
};
