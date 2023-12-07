import { Injectable } from '@angular/core';
import { Auth, AuthError, authState, createUserWithEmailAndPassword, signInWithCustomToken, signInWithEmailAndPassword, signOut, updateProfile, User,user } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = user(this.auth);
  authState$ = authState(this.auth);

  constructor(
    private readonly auth: Auth,
    private readonly firestore: Firestore,
    private readonly functions: Functions
  ) {
  }

  async createUserOrSignIn(email: string, test: string) {
    try {
      return await createUserWithEmailAndPassword(this.auth, email, test)
        .then(userCredential => {
          const { user } = userCredential;
          return updateProfile(user, {
            displayName: user.email?.split('@')[0] || 'User'
          }).then(() => userCredential);
        });
    } catch (err) {
      if ((err as AuthError).code === 'auth/email-already-in-use') {
        return await signInWithEmailAndPassword(this.auth, email, test);
      } else {
        return;
      }
    }
  }

  getCustomTokenByVerification(verificationId: string, code: string) {
    const getCustomTokenByVerification =
      httpsCallable<
        { verificationId: string, code: string },
        { userRecord: Partial<User>, token: string }>(this.functions, 'getCustomTokenByVerification');
    return getCustomTokenByVerification({ verificationId, code });
  }

  getCustomTokenByBrowserUser(browserId: string, uid: string) {
    const getCustomTokenByBrowserUser =
      httpsCallable<{ browserId: string, uid: string }, string>(this.functions, 'getCustomTokenByBrowserUser');
    return getCustomTokenByBrowserUser({ browserId, uid });
  }

  signInWithCustomToken(token: string) {
    return signInWithCustomToken(this.auth, token);
  }

  signOut() {
    return signOut(this.auth);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  updateUserInfo({ displayName, photoURL }: { [key: string]: string }) {
    const user = this.getCurrentUser();
    if (user) {
      return updateProfile(user, { displayName, photoURL });
    } else {
      return Promise.reject('user not exist');
    }
  }

}
