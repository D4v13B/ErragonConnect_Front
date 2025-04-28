import { User } from "@/context/auth-context";
import { erragonApi } from "../erragonApi";

export const loginApi = async (email: string, password: string) : Promise<User | null> => {
  try {
    const { data } = await erragonApi.post<User>("/auth/login", {
      email,
      password
    });

    return data;
  } catch (error) {
    console.error(error);
    return null
  }
};
