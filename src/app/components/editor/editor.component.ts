import {Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SaveService} from "../../services/save.service";
import {SavedHtml} from "../../models/saved-html";
import {Router} from "@angular/router";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  @ViewChild('previewContainer') previewContainer!: ElementRef;
  @Input() htmlContent!: string;
  @Output() contentChanged = new EventEmitter<string>();
  @Input() savedHtml!: SavedHtml | null; //means we edit a saved content
  isMobile: boolean = true;

  constructor(private authService: AuthService, private snackBar: MatSnackBar, private saveService: SaveService, private router: Router) { }

  ngOnInit(): void {
    const savedContent = localStorage.getItem('editorContent');
    if (savedContent && !this.savedHtml) {
      this.htmlContent = savedContent;
      this.updatePreview();
    }
  }

  //save current content when page is left
  ngOnDestroy(): void {
    if (this.htmlContent && !this.savedHtml) {
      localStorage.setItem('editorContent', this.htmlContent);
    }
    //Clear editing object
    this.savedHtml = null;
  }

  onContentChange(): void {
    this.updatePreview();
  }

  updatePreview(): void {
    this.previewContainer.nativeElement.innerHTML = this.htmlContent;
  }

  async onSave() {
    if (this.savedHtml) {
      this.savedHtml.content = this.htmlContent;

      this.saveService.updateSave(this.savedHtml).then(() => {
        this.snackBar.open('Updated successfully', 'Close', {
          duration: 2000,
        });
      });
      return;
    }


    //Check if user is logged in
    if (!this.authService.isLoggedIn) {
      this.snackBar.open('You must be logged in to save content', 'Close', {
        duration: 2000,
      });
      return;
    }

    //Create a dialog to get an input for the name of the save
    const saveName = prompt('Enter a name for the save');
    if (!saveName) {
      return;
    }
    //Save the content to the database
    let html: SavedHtml = {
      content: this.htmlContent,
      title: saveName,
      id: this.generateUUID(),
      userId: await this.authService.getUid() as string,
      createdAt: new Date().getMilliseconds()
    }

    this.saveService.saveContent(html).then(() => {
      this.snackBar.open('Saved successfully', 'Close', {
        duration: 2000,
      });
    });
  }

  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  onClear() {
    this.htmlContent = '';
    //Clear from local storage
    localStorage.removeItem('editorContent');
    this.updatePreview();
  }

  //Listen to screen size changes
  onResize(event: any) {
    this.isMobile = event.target.innerWidth < 768;
  }

  onBack() {
    //navigate back to saves
    this.router.navigate(['/saves']);
  }
}
