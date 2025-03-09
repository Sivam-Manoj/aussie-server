import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/asynchandler/asyncHandler.js';
import { searchIndex } from '../../utils/chromadb/SearchChromaCollection.js';

export const getPlayerController = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { search } = req.body;
    if (!search) {
      res.json(404).json({ message: 'Please Provide Search' });
    }
    try {
      const results = await searchIndex(search);

      res.status(200).json(results);
    } catch (error) {
      res.json(500).json({ message: 'Internel Server Error' });
    }
  }
);
