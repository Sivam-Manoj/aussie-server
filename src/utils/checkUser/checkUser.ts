import { Response } from "express";

export const checkUser = (res: Response, user: boolean) => {
  if (!user) {
    res.cookie("jwt", "", {
     // domain: "aussierulespro.com", // Same domain as when the cookie was set
      path: "/", // Same path as when the cookie was set
      sameSite: "none",
      secure: process.env.NODE_ENV === "production", // Ensures secure flag is honored in production
      expires: new Date(0), // Expire the cookie immediately
    });

    // Set the refreshJwt cookie to an empty value with an expired date
    res.cookie("refreshJwt", "", {
     // domain: "aussierulespro.com", // Same domain as when the cookie was set
      path: "/", // Same path as when the cookie was set
      sameSite: "none",
      secure: process.env.NODE_ENV === "production", // Ensures secure flag is honored in production
      expires: new Date(0), // Expire the cookie immediately
    });
  }
};
