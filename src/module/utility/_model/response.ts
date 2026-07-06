import { z } from 'zod';
import { BaseResponseSchema } from '../../../utils/types';

export const PingResponseSchema = BaseResponseSchema(z.string());
export type PingResponse = z.infer<typeof PingResponseSchema>;
