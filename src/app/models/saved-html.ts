export interface SavedHtml {
  id: string; //uuid
  title: string; //title of the saved html
  content: string; //html content
  userId: string; // uid of the user who saved the html
  createdAt: number; //timestamp
}
