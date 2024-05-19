import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {SavedHtml} from "../models/saved-html";
import firebase from "firebase/compat";
import DocumentReference = firebase.firestore.DocumentReference;
import {User} from "../models/user";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class SaveService {

  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  // Save the content to the database
  saveContent(html: SavedHtml): Promise<DocumentReference<SavedHtml>> {
    //Schema:
    // collection: htmls
    // document: //has a random generated id
    //    content: string
    //    createdAt: timestamp
    //    id: string //uuid
    //    title: string
    //    userId: string //uid of the user who saved the html
    return this.firestore.collection<SavedHtml>('htmls').add(html);
  }

  //get saves by user
  async getSavesByUser(user1: Promise<User>) {
    let user = await user1;
    //return this.firestore.collection<SavedHtml>('saved-html', ref => ref.where('user_id', '==', user.id)).valueChanges();
    return this.firestore.collection<SavedHtml>('htmls', ref => ref.where('userId', '==', user.uid).orderBy('createdAt', 'desc')).valueChanges();
  }

  //get save by id
  async getSaveById(user1: Promise<User>, id: string) {
    let user = await user1;
    return this.firestore.collection<SavedHtml>('htmls', ref => ref.where('userId', '==', user.uid).where('id', '==', id)).valueChanges();
  }

  //update save by id
  async updateSave(html: SavedHtml) {
    return this.firestore.collection('htmls', ref => ref.where('id', '==', html.id)).snapshotChanges().subscribe(res => {
      res.forEach(doc => {
        this.firestore.doc(`htmls/${doc.payload.doc.id}`).update(html);
      });
    });
  }

  //delete save by id
  async deleteSave(id: string) {
    return this.firestore.collection('htmls', ref => ref.where('id', '==', id)).snapshotChanges().subscribe(res => {
      res.forEach(doc => {
        this.firestore.doc(`htmls/${doc.payload.doc.id}`).delete();
      });
    });
  }
}
