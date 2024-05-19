import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import User = firebase.User;
import UserCredential = firebase.auth.UserCredential;
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;
  loaded = false;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.user$ = this.afAuth.authState;
    this.user$.subscribe(user => {
      if (user) {
        this.setLoggedIn(true);
        console.log("User is logged in")
      } else {
        this.setLoggedIn(false);
        console.log("User is logged out")
      }
      this.loaded = true;
    });
  }

  isLoggedIn(): boolean {
    const loggedIn = localStorage.getItem('isLoggedIn');
    return loggedIn === 'true';
  }

  setLoggedIn(value: boolean) {
    localStorage.setItem('isLoggedIn', String(value));
  }

  // Bejelentkezés
  async signIn(email: string, password: string): Promise<UserCredential> {
    return await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Kijelentkezés
  async signOut(): Promise<void> {
    return await this.afAuth.signOut();
  }

  // Regisztráció
  async signUp(username: string, email: string, password: string): Promise<UserCredential> {
    let result = await this.afAuth.createUserWithEmailAndPassword(email, password);
    //Create username in the usernames firebase document with the user's id.
    //Schema: uid - user uid
    //        username - username
    if (result.user) {
      let user = result.user;
      let db = firebase.firestore();
      //Auto generate document id
      let docRef = db.collection('usernames').doc();
      await docRef.set({
        uid: user.uid,
        username: username
      });
    }

    return result;
  }

  async updateProfile(password: string, profilePicture: string | null, username: string) {
    let user = this.afAuth.currentUser;
    if (user) {
      user.then(value => {
        if (value) {
          if (password) {
            value.updatePassword(password.trim()).catch(async error => {
              if (error.code === 'auth/user-token-expired') {
                // Refresh the token
                await value.getIdToken(true);
                // Retry the update
                await value.updatePassword(password.trim());
              }
            });
          }
          if (profilePicture) {
            this.changeProfilePicture(profilePicture)
          }
          if (username) {
            this.changeUsername(username)
          }
        }
      });
    }
  }

  getProfilePicture(): Promise<string> {

    //Read it from local storage
    let profilePicture = localStorage.getItem('profile_picture');
    if (profilePicture) {
      return new Promise((resolve, reject) => {
        resolve(profilePicture);
      });
    }

    return new Promise(async (resolve, reject) => {
      let user = await this.afAuth.currentUser;
      if (user) {
        let db = firebase.firestore();
        // Create a query with a where clause to get the profile picture by uid
        let query = db.collection('pfp').where('uid', '==', user.uid);
        query.get().then(querySnapshot => {
          if (!querySnapshot.empty) {
            // If a document is found for the user, resolve with the URL
            querySnapshot.forEach(doc => {
              resolve(doc.data()['url']);
            });
          } else {
            // If no document is found for the user, get the "default" document
            db.collection('pfp').doc('default').get().then(doc => {
              if (doc.exists && doc.data() && doc.data()!['url']) {
                //save it to local storage
                localStorage.setItem('profile_picture', doc.data()!['url']);

                // If the "default" document exists, resolve with the URL
                resolve(doc.data()!['url']);
              } else {
                reject('No default profile picture found');
              }
            }).catch(error => {
              reject(error);
            });
          }
        }).catch(error => {
          reject(error);
        });
      } else {
        reject('No user is currently logged in');
      }
    });
  }

  //Delete account
  async deleteAccount() {
    let user = await this.afAuth.currentUser;
    if (user) {
      return user.delete();
    }
  }

  async getUsername(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      let user = await this.afAuth.currentUser;
      if (user) {
        let db = firebase.firestore();
        //Create a query with a where clause to get the username by uid
        db.collection('usernames').where('uid', '==', user.uid).get().then(querySnapshot => {
          querySnapshot.forEach(doc => {
            resolve(doc.data()['username']);
          });
        }).catch(error => {
          reject(error);
        });
      } else {
        reject('No user is currently logged in');
      }
    });
  }

  // Change username
  async changeUsername(newUsername: string): Promise<void> {
    let user = await this.afAuth.currentUser;
    if (user) {
      let db = firebase.firestore();
      // Update the username in the 'usernames' collection
      return db.collection('usernames').where('uid', '==', user.uid).get().then(querySnapshot => {
        //Check if the user has a document in the usernames collection
        if (querySnapshot.empty) {
          //If the user does not have a document in the usernames collection, create one
          db.collection('usernames').doc().set({
            uid: user.uid,
            username: newUsername
          });
          return;
        }

        querySnapshot.forEach(doc => {
          doc.ref.update({
            username: newUsername
          });
        });
      });
    } else {
      throw new Error('No user is currently logged in');
    }
  }

// Change profile picture
  async changeProfilePicture(newProfilePictureUrl: string): Promise<void> {
    // Save the profile picture URL to local storage
    localStorage.setItem('profile_picture', newProfilePictureUrl);

    let user = await this.afAuth.currentUser;
    if (user) {
      let db = firebase.firestore();
      // Update the profile picture URL in the 'pfp' collection
      return db.collection('pfp').where('uid', '==', user.uid).get().then(querySnapshot => {
        //Check if the user has a document in the pfp collection
        if (querySnapshot.empty) {
          //If the user does not have a document in the pfp collection, create one
          db.collection('pfp').doc().set({
            uid: user.uid,
            url: newProfilePictureUrl
          });
          return;
        }

        querySnapshot.forEach(doc => {
          doc.ref.update({
            url: newProfilePictureUrl
          });
        });
      });
    } else {
      throw new Error('No user is currently logged in');
    }
  }

  async getUid() {
    let user = await this.afAuth.currentUser;
    return user?.uid;
  }

  async getInternalUser() {
    //wait till the user is loaded
    while (!this.loaded) {
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    let user = {
      uid: '',
      username: '',
      profile_picture_url: ''
    };

    let name = await this.getUsername();
    let picture = await this.getProfilePicture();
    let currentUser = await this.getUid();
    user.uid = currentUser!;
    user.username = name;
    user.profile_picture_url = picture;
    return user;
  }
}
