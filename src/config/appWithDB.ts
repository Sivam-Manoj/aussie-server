import mongoose from 'mongoose';
import { Express } from 'express';

export const appwithDB = async (app: Express) => {
  const port = process.env.PORT || 3000;
  const mongo_url = process.env.MONGO_URL as string;
  const base_url = process.env.BASE_URL as string;
  try {
    await mongoose.connect(mongo_url);
    console.log('database connected succesfully');
    app.listen(port, () => {
      console.log(`Server running on:${base_url}:${port}`);
    });
  } catch (error) {
    throw new Error(`Internel Server Error : ${error}`);
  }
};
