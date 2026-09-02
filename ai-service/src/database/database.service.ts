import { neon } from '@neondatabase/serverless';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
    private readonly sql;

    constructor(private configService: ConfigService) {
        const databaseUrl = this.configService.get<string>('DATABASE_URL');
        if (!databaseUrl) {
            throw new Error('DATABASE_URL is not defined in environment variables');
        }
        this.sql = neon(databaseUrl);
    }

    async getData() {
        const data = await this.sql`SELECT NOW()`; // Placeholder query
        return data;
    }
}
