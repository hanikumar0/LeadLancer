import { Request, Response, NextFunction } from 'express';
import { createResponse } from '../utils/response';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json(createResponse(false, err.message || 'Server Error'));
};
