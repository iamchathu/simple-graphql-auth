import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class TokenResponse {
  @Field()
  token!: string;

  @Field({ nullable: true })
  refreshToken?: string;
}
