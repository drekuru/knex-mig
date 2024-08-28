import { EnvConfig } from '../types';
import knex, { Knex } from 'knex';
import { knexSnakeCaseMappers, safeRead } from '../utils';
import { EnvManager } from './env.manager';

/**
 * @description Handles the knex configuration and connection to the database
 * // TODO: make this more dynamic and configurable
 */
export class ConnectionManager {
    private static _config: EnvConfig;
    private static _knex: Knex<any, unknown[]>;

    static get knex(): Knex<any, unknown[]> {
        if (!this._knex) {
            this._knex = knex(this.mapEnvsToKnexConfig());
        }
        return this._knex;
    }

    // TODO: figure out the type here
    static async getKnexUser(): Promise<any> {
        if (this.knex?.client.config.connection instanceof Function) {
            const connection = await this.knex.client.config.connection();
            return connection.user;
        } else return this.knex.client.config.connection.user;
    }

    private static buildConfig(): EnvConfig {
        EnvManager.get();
        const searchPath = safeRead('SEARCH_PATH')?.split(',');

        const config = {
            DATABASE: safeRead('DATABASE'),
            HOST: safeRead('HOST'),
            PASSWORD: safeRead('PASSWORD'),
            USER: safeRead('USER'),
            APP_NAME: process.env.APP_NAME,
            CLIENT: safeRead('CLIENT'),
            PORT: Number(safeRead('PORT')),
            CONNECTION_TIMEOUT: Number(process.env.CONNECTION_TIMEOUT || '60000'),
            IDLE_IN_TRANSACTION_TIMEOUT: Number(process.env.IDLE_IN_TRANSACTION_TIMEOUT || '15000'),
            MAX_POOL_SIZE: Number(process.env.MAX_POOL_SIZE || '10'),
            MIN_POOL_SIZE: Number(process.env.MIN_POOL_SIZE || '0'),
            SSL_ENABLED: process.env.SSL_ENABLED === 'true',
            SSL_CA: process.env.SSL_CA,
            SSL_CERT: process.env.SSL_CERT,
            SSL_KEY: process.env.SSL_KEY,
            SSL_REJECT_UNAUTHORIZED: process.env.SSL_REJECT_UNAUTHORIZED === 'true',
            MIGRATIONS_SCHEMA: process.env.MIGRATIONS_SCHEMA,
            MIGRATIONS_DIR: safeRead('MIGRATIONS_DIR'),
            SEARCH_PATH: searchPath
        };

        return config;
    }

    static get config(): EnvConfig {
        if (!this._config) {
            this._config = this.buildConfig();
        }
        return this._config;
    }

    private static mapEnvsToKnexConfig(): Knex.Config {
        const config = this.config;
        return {
            client: config.CLIENT,
            connection: {
                host: config.HOST,
                user: config.USER,
                password: config.PASSWORD,
                database: config.DATABASE,
                port: config.PORT,
                ssl: undefined,
                application_name: config.APP_NAME,
                idle_in_transaction_session_timeout: config.IDLE_IN_TRANSACTION_TIMEOUT
            },
            pool: {
                acquireTimeoutMillis: config.CONNECTION_TIMEOUT,
                min: config.MIN_POOL_SIZE,
                max: config.MAX_POOL_SIZE
            },
            migrations: {
                directory: config.MIGRATIONS_DIR,
                schemaName: config.MIGRATIONS_SCHEMA
            },
            searchPath: config.SEARCH_PATH,
            ...knexSnakeCaseMappers()
        };
    }

    static async destroy(): Promise<void> {
        if (this.knex) await this.knex.destroy();
    }
}
