import { Request, Response } from "express";
import User from "../../model/userModel/userModel.js";
import asyncHandler from "express-async-handler";

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const pageSize = 10;
  const page = Number(req.query.page) || 1;
  const search = req.query.search as string || "";

  const query = {
    $or: [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ],
  };

  const count = await User.countDocuments(query);
  const users = await User.find(query)
    .select("-password -verificationCode -verificationCodeExpiresAt")
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    users,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});


export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select(
    "-password -verificationCode -verificationCodeExpiresAt"
  );

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});


export const getUserStats = asyncHandler(async (req: Request, res: Response) => {
  const totalUsers = await User.countDocuments();
  const verifiedUsers = await User.countDocuments({ isVerified: true });
  const activeUsers = await User.countDocuments({ isActive: true });
  const profileCompletedUsers = await User.countDocuments({ isProfileDone: true });

  res.json({
    totalUsers,
    verifiedUsers,
    activeUsers,
    profileCompletedUsers,
    unverifiedUsers: totalUsers - verifiedUsers,
    inactiveUsers: totalUsers - activeUsers,
    profileIncompleteUsers: totalUsers - profileCompletedUsers,
  });
});
