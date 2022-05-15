import 'dotenv/config';

const config = {
  app: {
    port: process.env.PORT ?? 4008,
  },
  auth: {
    issuer: process.env.AUTH_ISSUER ?? 'http://localhost:4004/',
    audience: process.env.AUTH_AUDIENCE ?? 'http://localhost:3000/',
    expireTime: process.env.AUTH_EXPIRE_TIME ?? '5m',
    refreshExpireTime: process.env.AUTH_REFRESH_EXPIRE_TIME ?? '7d',
    secret: process.env.AUTH_SECRET ?? 'pv5+qIpYkkwezTlxCsmxNx+EoHsMYZU6PSNTMqJVfWtruLx/cw21JRBtBHTiB3Lp96Cs3IXtop',
  },
  database: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    user: process.env.DATABASE_USER ?? 'root',
    password: process.env.DATABASE_PASSWORD ?? 'pg123',
    database: process.env.DATABASE_NAME ?? 'simple-db',
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  },
  cors: {
    methods: ['GET', 'POST'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    origin: process.env.ALLOWED_DOMAINS ? process.env.ALLOWED_DOMAINS.split(',') : ['http://localhost:7777'],
  },
  redis: {
    host: process.env.REDIS_HOST ?? '',
    port: parseInt(process.env.REDIS_PORT ?? '', 10),
    password: process.env.REDIS_PASSWORD ?? '',
    db: parseInt(process.env.REDIS_DB ?? '0', 10),
  },
};

export default config;
