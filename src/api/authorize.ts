import storage from "@/storage";
import { UserInterface } from "@/interfaces/user";
import fetchWrapper from "./fetchWrapper";
import User = UserInterface.User;
import { vxm } from "@/vuex";
import api from ".";

interface ChangePasswordBody {
  newPassword: string;
  confirmPassword: string;
  lang: string;
}

interface ChangePassword {
  refresh: boolean;
  errors?: string;
}

export default class AuthorizeMethods {
  private static cleanLoginInfo(): void {
    storage.user = null;
  }

  public async getUser(): Promise<User | undefined> {
    try {
      const success = await fetch(
        String(process.env.VUE_APP_API_URL + `/api/Authorize/GetUser`),
        {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await success.json();

      if (!data.success) {
        storage.user = null;
        return
      }

      storage.user = data.success;
      vxm.user.user = data.success;
      api.balance.setBalance();

      return data.success;
    } catch (error) {
      const evt = new CustomEvent("customerror", { detail: { error: error } });
      window.dispatchEvent(evt);
      storage.user = null;
    }
  }

  public async login(
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<boolean> {
    return await fetchWrapper<boolean>(`/api/Authorize/Login`, {}, "POST", {
      email,
      password,
      rememberMe,
    });
  }

  public async changePassword(
    body: ChangePasswordBody
  ): Promise<ChangePassword> {
    return await fetchWrapper<ChangePassword>(
      `/api/Authorize/ChangePassword`,
      {},
      "POST",
      body
    );
  }

  public async register(params: RegisterParams): Promise<RegisterResponse> {
    try {
      const data = await fetchWrapper<boolean>(
        `/api/Authorize/Register`,
        {},
        "POST",
        params
      );
      return { register: data };
    } catch (error) {
      const e = error as any;
      throw { register: false, errors: e.errors };
    }
  }

  public async update(
    profile: UserInterface.User
  ): Promise<{ updated: boolean }> {
    return await fetchWrapper<{ updated: boolean }>(
      `/api/Authorize/Update`,
      {},
      "POST",
      profile
    );
  }

  public async logout(): Promise<void> {
    await fetchWrapper(`/api/Authorize/Logout`, {}, "POST", null);
    AuthorizeMethods.cleanLoginInfo();
  }

  public async isAuthenticated(): Promise<boolean> {
    try {
      return await fetchWrapper<boolean>(`/api/Authorize/IsAuthenticated`, {});
    } catch (error) {
      AuthorizeMethods.cleanLoginInfo();
      return false;
    }
  }

  public async forgotPassword(email: string): Promise<boolean> {
    return await fetchWrapper<boolean>(
      `/api/Authorize/ForgotPassword`,
      {},
      "POST",
      { email }
    );
  }

  public async resetPassword(
    email: string,
    token: string,
    newPassword: string
  ): Promise<boolean> {
    return await fetchWrapper<boolean>(
      `/api/Authorize/ResetPassword`,
      {},
      "POST",
      { email, token, newPassword }
    );
  }

  public async verifyEmail(): Promise<boolean> {
    return await fetchWrapper<boolean>(
      `/api/Authorize/VerifyEmail`,
      {},
      "POST",
      {}
    );
  }
}

export interface RegisterParams {
  password: string;
  passwordConfirm: string;
  email: string;
  phoneNumber: string;
  lang?: string;
  currencyId: number | null;
  countryId: number | null;
  userFirstName: string;
  userMiddleName?: string;
  userLastName: string;
  organizationName?: string;
  captureText?: string;
  isUserAgreed: boolean;
  address?: string;
  mmcFlashKey?: string;
  mmcFlashLicence?: string;
  attributes?: string;
}

interface RegisterResponse {
  register: boolean;
  errors?: Array<{
    field: string;
    code: string;
    error: string;
  }>;
}
