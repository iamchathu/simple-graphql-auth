import { Arg, Mutation, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { dataSource } from '../../config/database';
import { User } from '../../database/entities/user';
import { generateRefreshToken, generateToken, verifyRefreshToken } from '../auth';
import { TokenResponse } from '../response/auth';

@Resolver()
export class AuthResolver {
  #repository: Repository<User>;

  constructor() {
    this.#repository = dataSource.getRepository(User);
  }

  @Mutation(() => TokenResponse)
  async login(@Arg('userName') username: string, @Arg('password') password: string): Promise<TokenResponse> {
    let user = await this.#repository.findOneBy({ username });
    if (user) {
      if (user.authenticate(password)) {
        if (!user.isActive) {
          throw Error('Account is not active.');
        }
        user.refreshToken = uuidV4();
        user = await this.#repository.save(user);

        return {
          token: generateToken({ id: user.id, name: user.name, userName: user.username }),
          refreshToken: generateRefreshToken({ code: user.refreshToken as string }),
        };
      }
    }
    throw Error('Authentication error!');
  }

  @Mutation(() => TokenResponse)
  async refreshToken(@Arg('refreshToken') refreshToken: string): Promise<TokenResponse> {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await this.#repository.findOneBy({ refreshToken: decoded?.code, isActive: true });
      if (user) {
        user.refreshToken = uuidV4();
        await this.#repository.save(user);
        return {
          token: generateToken({ id: user.id, name: user.name, userName: user.username }),
          refreshToken: generateRefreshToken({ code: user.refreshToken as string }),
        };
      }
    } catch {
      throw Error('Authentication error!');
    }
    throw Error('Authentication error!');
  }
}
