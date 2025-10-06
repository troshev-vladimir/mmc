export namespace UserInterface {
  export interface User {
    email: string;
    emailConfirmed: boolean;
    languageId: number;
    countryId: number;
    currencyId: number;
    userFirstName: string;
    userMiddleName?: string;
    userLastName: string;
    mmcFlashKeyHw?: string;
    phoneNumber: string;
    organizationName?: string;
  }
}
