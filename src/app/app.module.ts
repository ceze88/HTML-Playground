import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditorComponent } from './components/editor/editor.component';
import { PlaygroundComponent } from './pages/playground/playground.component';
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {environment} from "../enviroments/enviroment";
import {AngularFireModule} from "@angular/fire/compat";
import {HeaderComponent} from "./components/header/header.component";
import {SidenavComponent} from "./components/sidenav/sidenav.component";
import {MatExpansionPanelActionRow} from "@angular/material/expansion";
import {InputFormatterPipe} from "./pipes/input-formatter.pipe";

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    PlaygroundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatAutocompleteModule,
    AngularFireModule.initializeApp(environment.firebase),
    HeaderComponent,
    SidenavComponent,
    MatExpansionPanelActionRow,
    InputFormatterPipe,
  ],
  providers: [
    InputFormatterPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
