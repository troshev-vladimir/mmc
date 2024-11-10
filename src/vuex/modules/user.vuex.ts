import { createModule, mutation } from "vuex-class-component";
import { UserInterface } from '@/interfaces/user'
import User = UserInterface.User
const initialLang = process.env.lang || 'ru'

const VuexModule = createModule({
  namespaced: "user",
  strict: false,
});
export class UserStore extends VuexModule {
  public lang = initialLang;
  public userIsAuth = false;
  private currnetUser: User | null = null;
  private promocode = "";
  public balance = 0;

  @mutation setBalance(amount: number) {
    this.balance = amount;
  }

  @mutation setLang(lang: string) {
    this.lang = lang;
  }

  @mutation setPromocode(promocode: string) {
    this.promocode = promocode;
  }

  @mutation setUserIsAuth(value: boolean) {
    this.userIsAuth = value;
  }

  // @action async doSomethingAsync(payload) { return 20 }
  get user(): User | null {
    return this.currnetUser;
  }

  set user(user: User | null) {
    this.currnetUser = user;
  }

  get userPromocode(): string {
    return this.promocode;
  }

  set userPromocode(promocode: string) {
    this.promocode = promocode;
  }
}
export default UserStore;
