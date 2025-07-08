export interface IRegister {
  username: string;
  phone: string;
  email: string;
  password: string;
  createdOn: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IUser {
  username: string;
  email: string;
  phone: string;
}
export interface FireBaseLoginResponse {
  kind: string;
  localId: string;
  email: string;
  displayName: string;
  idToken: string;
  registered: boolean;
  refreshToken: string;
  expiresIn: string;
}
