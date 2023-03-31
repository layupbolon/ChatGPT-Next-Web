export interface BaseResponse<T> {
  code: string;
  message: string;
  result: T;
}

export interface UserInfo {
  id: number;
  nickName: string;
  openId: string;
  skey: string;
  account: string;
  password: string;
  sessionKey: string;
  lastVisitTime: string;
  city: string;
  province: string;
  country: string;
  avatarUrl: string;
  gender: number;
  registDate: string;
  dateOfBirth: null;
  createTime: string;
  updateTime: string;
  senderAccount: string;
  validateDate: string;
  state: number;
}

export interface LoginResult {
  user: UserInfo;
  token: string;
}
