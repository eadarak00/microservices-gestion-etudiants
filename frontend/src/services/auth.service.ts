import api from "../api/axios";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const loginAdmin = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", {
    username,
    password,
  });

  return response.data;
};

export const logoutAdmin = async (refreshToken: string) => {
  return api.post("/auth/logout", { refreshToken });
};
