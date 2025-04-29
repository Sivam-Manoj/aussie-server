import jwt from "jsonwebtoken";


// Function to create the JWT access token
export const createResetToken = (
 
  payload: {
    _id: string;
    email: string;  
  }
) => {
  try {
    // Generate JWT access token (expires in 7 days)
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
 

    return { accessToken };
  } catch (error) {
    console.error("Error creating JWT tokens:", error);
    throw error; // Handle this in the route
  }
};

 
