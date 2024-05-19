import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PlaygroundComponent} from "./pages/playground/playground.component";
import {ProfileComponent} from "./pages/profile/profile.component";
import {SavesComponent} from "./pages/saves/saves.component";
import {LoginComponent} from "./pages/login/login.component";
import {RegisterComponent} from "./pages/register/register.component";
import {authGuard} from "./auth.guard";

const routes: Routes = [
  { path: '', component: PlaygroundComponent},
  { path: 'playground', component: PlaygroundComponent },
  { path: 'playground/:id', component: PlaygroundComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
  { path: 'saves', component: SavesComponent, canActivate: [authGuard]},
  { path: 'saves/:id', component: SavesComponent, canActivate: [authGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
