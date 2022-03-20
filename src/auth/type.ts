export interface PostLoginRequestBody {
  email: string;
  password: string;
}

export interface PostRefreshTokenBody {
  refreshToken: string;
}

export interface PostRegisterRequestBody {
  email: string;
  password: string;
}

export interface PostRegisterResponseBody {
  message: string;
}
