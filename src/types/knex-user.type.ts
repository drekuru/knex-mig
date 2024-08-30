export type KnexUser = {
    host?: string;
    user?: string;
    database?: string;
    port?: number;
    ssl?: any;
    application_name?: string;
    idle_in_transaction_session_timeout?: number;
    password?: string;
};
