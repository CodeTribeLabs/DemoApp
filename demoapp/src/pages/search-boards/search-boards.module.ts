import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchBoardsPage } from './search-boards';

@NgModule({
  declarations: [
    SearchBoardsPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchBoardsPage),
  ],
})
export class SearchBoardsPageModule {}
