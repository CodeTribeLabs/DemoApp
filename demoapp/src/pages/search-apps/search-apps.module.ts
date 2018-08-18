import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchAppsPage } from './search-apps';

@NgModule({
  declarations: [
    SearchAppsPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchAppsPage),
  ],
})
export class SearchAppsPageModule {}
