// import { IAppState } from './app';
import { ILoading } from './loading';
// import { VerificationPopup } from './verificationPopup';
import { UserState } from './user';
import { GuestSSOState } from './sso';

export default interface AppState {
  // app: IAppState;
  loading: ILoading;
  // verificationPopup: VerificationPopup;
  user: UserState;
  sso: GuestSSOState;
}
