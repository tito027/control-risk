export interface IAuth {
  readonly carnet: string;
  readonly password: string;
}
export interface IAuthUser {
  readonly carnet: string;
  readonly password: string;
  readonly roleName: string;
}
