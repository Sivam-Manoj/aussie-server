import { Request, Response } from "express";
import User from "../../model/userModel/userModel.js";
import Admin from "../../model/adminModel/adminModel.js";
import asyncHandler from "express-async-handler";
import { createJwtToken } from "../../utils/jwt/createToken.js";

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

// Get all verified users
export const getVerifiedUsers = asyncHandler(async (req: Request, res: Response) => {
  const pageSize = 10;
  const page = Number(req.query.page) || 1;
  const search = req.query.search as string || "";

  const query = {
    isVerified: true,
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

// Get all unverified users
export const getUnverifiedUsers = asyncHandler(async (req: Request, res: Response) => {
  const pageSize = 10;
  const page = Number(req.query.page) || 1;
  const search = req.query.search as string || "";

  const query = {
    isVerified: false,
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

// Get all admin verified users
export const getAdminVerifiedUsers = asyncHandler(async (req: Request, res: Response) => {
  const pageSize = 10;
  const page = Number(req.query.page) || 1;
  const search = req.query.search as string || "";

  const query = {
    isAdminVerified: true,
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

// Approve user (set isAdminVerified to true)
export const approveUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.isAdminVerified = true;
  await user.save();

  res.json({
    message: "User approved successfully",
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdminVerified: user.isAdminVerified
    }
  });
});

// Reject user (set isAdminVerified to false)
export const rejectUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.isAdminVerified = false;
  await user.save();

  res.json({
    message: "User rejected successfully",
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdminVerified: user.isAdminVerified
    }
  });
});

// Get user statistics
export const getUserStats = asyncHandler(async (req: Request, res: Response) => {
  const totalUsers = await User.countDocuments();
  const verifiedUsers = await User.countDocuments({ isVerified: true });
  const adminVerifiedUsers = await User.countDocuments({ isAdminVerified: true });
  const activeUsers = await User.countDocuments({ isActive: true });
  const profileCompletedUsers = await User.countDocuments({ isProfileDone: true });

  res.json({
    totalUsers,
    verifiedUsers,
    adminVerifiedUsers,
    activeUsers,
    profileCompletedUsers,
    unverifiedUsers: totalUsers - verifiedUsers,
    unapprovedUsers: totalUsers - adminVerifiedUsers,
    inactiveUsers: totalUsers - activeUsers,
    profileIncompleteUsers: totalUsers - profileCompletedUsers,
  });
});

// Register first admin (only works if no admin exists)
export const registerFirstAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  // Check if any admin exists
  const adminExists = await Admin.findOne({});
  if (adminExists) {
    res.status(400);
    throw new Error("Admin already exists. Please use the regular admin registration process.");
  }

  // Create first admin with superadmin role
  const admin = await Admin.create({
    username,
    email,
    password,
    role: 'superadmin',
    isActive: true
  });

  if (admin) {
    createJwtToken(res, {
      _id: admin._id.toString(),
      email: admin.email,
      isVerified: true,
      role: admin.role
    });

    res.status(201).json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive
    });
  } else {
    res.status(400);
    throw new Error("Invalid admin data");
  }
});

// Admin login
export const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!admin.isActive) {
    res.status(403);
    throw new Error("Admin account is inactive");
  }

  const isPasswordValid = await admin.comparePassword(password);
  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  createJwtToken(res, {
    _id: admin._id.toString(),
    email: admin.email,
    isVerified: true,
    role: admin.role
  });

  res.json({
    _id: admin._id,
    username: admin.username,
    email: admin.email,
    role: admin.role,
    isActive: admin.isActive
  });
});
