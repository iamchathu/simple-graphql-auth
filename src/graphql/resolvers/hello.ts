import { Authorized, Query, Resolver } from 'type-graphql';

@Resolver()
export class HelloResolver {
  @Query(() => String)
  hello() {
    return 'Hello';
  }

  @Authorized()
  @Query(() => String)
  helloProtected() {
    return 'Hello';
  }
}
