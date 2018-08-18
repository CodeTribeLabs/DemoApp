import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserAppsPage } from './user-apps';

@NgModule({
  declarations: [
    UserAppsPage,
  ],
  imports: [
    IonicPageModule.forChild(UserAppsPage),
  ],
})
export class UserAppsPageModule {}
