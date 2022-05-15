import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { AuthChecker } from 'type-graphql';
import config from '../../config';
import { dataSource } from '../../config/database';
import { User } from '../../database/entities/user';
import { AppUser, Context } from '../context';

interface RefreshToken {
  code: string;
}

export const extractTokenFromRequest = (req: Request): string | undefined => {
  const parts = req.headers?.authorization?.split(' ');
  if (parts && parts.length === 2) {
    const [, token] = parts;
    return token;
  }
  return undefined;
};

export const generateToken = (user: AppUser): string =>
  jwt.sign({ ...user }, config.auth.secret, {
    algorithm: 'HS256',
    audience: config.auth.audience,
    issuer: config.auth.issuer,
    expiresIn: config.auth.expireTime,
  });

export const generateRefreshToken = (data: RefreshToken): string =>
  jwt.sign({ ...data }, config.auth.secret, {
    algorithm: 'HS256',
    audience: config.auth.audience,
    issuer: config.auth.issuer,
    expiresIn: config.auth.refreshExpireTime,
  });

export const verifyToken = (token: string): AppUser | undefined => {
  try {
    const decoded = jwt.verify(token, config.auth.secret, {
      algorithms: ['HS256'],
      audience: config.auth.audience,
      issuer: config.auth.issuer,
    });
    if (decoded) {
      return { id: (decoded as any)?.id, name: (decoded as any)?.name, userName: (decoded as any)?.userName };
    }
    return undefined;
  } catch {
    return undefined;
  }
};

export const verifyRefreshToken = (token: string): RefreshToken | undefined => {
  const decoded = jwt.verify(token, config.auth.secret, {
    algorithms: ['HS256'],
    audience: config.auth.audience,
    issuer: config.auth.issuer,
  });
  if (decoded) {
    return { code: (decoded as any)?.code };
  }
  return undefined;
};

const authChecker: AuthChecker<Context> = async ({ context }) => {
  if (context.appUser?.id) {
    const user = await dataSource.getRepository(User).findOne({
      where: { id: context.appUser.id },
    });
    if (user && user.isActive) {
      return true;
    }
  }
  return false;
};

export default authChecker;
