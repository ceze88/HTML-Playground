import { Component } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {SavedHtml} from "../../models/saved-html";
import {SaveService} from "../../services/save.service";
import {AuthService} from "../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {ShareService} from "../../services/share.service";
import {Shared} from "../../models/shared";

@Component({
  selector: 'app-shares',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './shares.component.html',
  styleUrl: './shares.component.scss'
})
export class SharesComponent {

  shares: Shared[] = [];
  loaded = false;

  constructor(private shareService: ShareService, private authService: AuthService, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.shareService.getSharesByUser(this.authService.getInternalUser()).then(saves => {
      saves.subscribe(res => {
        this.shares = res;
        this.loaded = true;
      })
    });
  }

  editSave(shared: Shared) {
    //update timestamp
  }

  deleteShare(id: string) {
    this.shareService.deleteShare(id).then(() => {
      this.snackBar.open('Save deleted', 'Close', {
        duration: 3000
      });
    });
  }

  updateSave(shared: Shared) {
    this.shareService.updateShare(shared).then(() => {
      this.snackBar.open('Save updated', 'Close', {
        duration: 3000
      });
    });
  }

  getShareUrl(share: Shared) {
    return window.location.origin + '/share/' + share.id;
  }
}
