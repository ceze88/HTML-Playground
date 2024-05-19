import { Component } from '@angular/core';
import {SaveService} from "../../services/save.service";
import {SavedHtml} from "../../models/saved-html";
import {AuthService} from "../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {ShareService} from "../../services/share.service";

@Component({
  selector: 'app-saves',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './saves.component.html',
  styleUrl: './saves.component.scss'
})
export class SavesComponent {

  saves: SavedHtml[] = [];
  loaded = false;

  constructor(private saveService: SaveService, private authService: AuthService, private snackBar: MatSnackBar, private router: Router, private shareService: ShareService) { }

  ngOnInit(): void {
    this.saveService.getSavesByUser(this.authService.getInternalUser()).then(saves => {
      saves.subscribe(res => {
        this.saves = res;
        this.loaded = true;
      })
    });
  }

  editSave(html: SavedHtml) {
    this.router.navigate(['/playground/'+html.id], { state: { html } });
  }

  deleteSave(id: string) {
    this.saveService.deleteSave(id).then(() => {
      this.snackBar.open('Save deleted', 'Close', {
        duration: 3000
      });
    });
  }

  updateSave(html: SavedHtml) {
    this.saveService.updateSave(html).then(() => {
      this.snackBar.open('Save updated', 'Close', {
        duration: 3000
      });
    });
  }
}
