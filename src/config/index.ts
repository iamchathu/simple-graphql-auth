import 'dotenv/config';

const config = {
  app: {
    port: process.env.PORT ?? 4008,
  },
  auth: {
    userName: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
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
