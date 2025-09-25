
export interface ITag {
  _id: string;
  title: string;
  is_active: boolean;
}

export interface UserState {
  _id: 0;
  isLoggedIn: boolean;
  email_verification: false;
  userData: {};
  token?: string;
  isWelcome: boolean;
  isSplash: boolean;
  cardLength: number;
  catalogLength: number;
  ssoUserObjectId:string;
}

// export interface UserState {
//   _id: 0;
//   isLoggedIn: boolean;
//   email_verification: false;
//   userData: {};
//   token?: string;
//   ssoEnable: boolean;
//   profilePic?: string;
//   api_key: string;
//   businessTypeName: string;
//   business_info: [];
//   business_name: string;
//   companyDescription: string;
//   created_at: string;
//   email: string;
//   emailChange: {};
//   email_settings: {};
//   first_name: string;
//   firstName: string;
//   followers: [];
//   followings: [];
//   homeOnboarding: false;
//   images: {};
//   buyer_info: [];
//   ssoImage: any;
//   isTrashed: false;
//   isTrusted: false;
//   last_name: string;
//   location: string;
//   logins: [];
//   metaTags: {};
//   phone: {};
//   phone_number_verification: false;
//   profileCompletion: number | string;
//   profileOnboarding: false;
//   shortlists: [];
//   signup_type: string;
//   status: {};
//   subscribe_to_posts: false;
//   topVendor: false;
//   unique_url: string;
//   updated_at: string;
//   user_type: string;
//   username: string;
//   usernameChange: {};
//   website: string;
//   wholeSaleMember: false;
//   user_dashboard: string;
//   mobileVerification: boolean;
//   buyerInfo: any;
//   user_cart_count: integer;
//   sellerSubscriptionStatus: integer;
//   sellerSubscriptionExpiredStatus: boolean;
// }

export interface IMyTags {
  user_id: number | string;
  user_moods: ITag[] | undefined;
  user_mediums: ITag[] | undefined;
  user_tags: ITag[] | undefined;
}
