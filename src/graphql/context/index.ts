export interface AppUser {
  id: string;
  name: string;
  userName: string;
}

export interface Context {
  token?: string;
  appUser?: AppUser;
}
