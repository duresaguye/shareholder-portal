import { defineConfig } from '@prisma/sdk';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  datasource: {
    db: {
      url: process.env.DATABASE_URL!,
    },
  },
});
