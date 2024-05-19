import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Shared} from "../models/shared";
import firebase from "firebase/compat";
import DocumentReference = firebase.firestore.DocumentReference;
import {AuthService} from "./auth.service";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  // Save the share into the database
  createShare(shared: Shared): Promise<DocumentReference<Shared>> {
    return this.firestore.collection<Shared>('shares').add(shared);
  }

  //get shares by user
  async getSharesByUser(user1: Promise<User>) {
    let user = await user1;
    return this.firestore.collection<Shared>('shares', ref => ref.where('userId', '==', user.uid)).valueChanges();
  }

  //get save by id
  async getShareById(user1: Promise<User>, id: string) {
    let user = await user1;
    return this.firestore.collection<Shared>('shares', ref => ref.where('userId', '==', user.uid).where('id', '==', id)).valueChanges();
  }

  //update save by id
  async updateShare(shared: Shared) {
    return this.firestore.collection('shares', ref => ref.where('id', '==', shared.id)).snapshotChanges().subscribe(res => {
      res.forEach(doc => {
        this.firestore.doc(`shared/${doc.payload.doc.id}`).update(shared);
      });
    });
  }

  //delete save by id
  async deleteShare(id: string) {
    return this.firestore.collection('shared', ref => ref.where('id', '==', id)).snapshotChanges().subscribe(res => {
      res.forEach(doc => {
        this.firestore.doc(`shared/${doc.payload.doc.id}`).delete();
      });
    });
  }
}
