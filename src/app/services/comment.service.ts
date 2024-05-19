import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import {HtmlComment} from "../models/html-comment";
import firebase from "firebase/compat";
import DocumentReference = firebase.firestore.DocumentReference;

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private firestore: AngularFirestore) {}

  // Megjegyzések lekérdezése
  getComments(): Observable<HtmlComment[]> {
    return this.firestore.collection<HtmlComment>('comments').valueChanges();
  }

  // Adott megjegyzés lekérdezése
  getComment(id: string): Observable<HtmlComment | undefined> {
    return this.firestore.doc<HtmlComment>(`comments/${id}`).valueChanges();
  }

  // Megjegyzés hozzáadása
  addComment(comment: HtmlComment): Promise<DocumentReference<HtmlComment>> {
    return this.firestore.collection<HtmlComment>('comments').add(comment);
  }

  // Megjegyzés frissítése
  updateComment(id: string, comment: HtmlComment): Promise<void> {
    return this.firestore.doc<HtmlComment>(`comments/${id}`).update(comment);
  }

  // Megjegyzés törlése
  deleteComment(id: string): Promise<void> {
    return this.firestore.doc<HtmlComment>(`comments/${id}`).delete();
  }
}
