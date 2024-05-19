import { Component, ViewChild, ElementRef } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SavedHtml} from "../../models/saved-html";
import {SaveService} from "../../services/save.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent {
  @ViewChild('previewContainer', { static: true }) previewContainer!: ElementRef;

  htmlContent = '';
  editing: SavedHtml | null = null;

  constructor(private router: Router, private route: ActivatedRoute, private saveService: SaveService, private authService: AuthService) {}

  ngOnInit(): void {
    let path = this.route.snapshot.url[0].path;
    if (path === 'playground') {
      let uuid = this.router.url.split('/').pop();
      if (!uuid) {
        return;
      }
      //get the saved content
      this.saveService.getSaveById(this.authService.getInternalUser(), uuid).then(save => {
        save.subscribe(res => {
          this.editing = res[0];
          this.htmlContent = this.editing.content;
          this.updatePreview();
        });
      });
    }
  }

  updatePreview() {
    if (this.previewContainer && this.previewContainer.nativeElement) {
      this.previewContainer.nativeElement.innerHTML = this.htmlContent;
    }
  }
}
