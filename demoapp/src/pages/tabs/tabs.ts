import { Component, ViewChild } from '@angular/core';
import { Tabs, Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { UserAccountPage } from '../user-account/user-account';
import { BoardsPage } from '../boards/boards';

import { UserDataProvider } from '../../providers/user-data/user-data';
import { TransitionProvider } from '../../providers/transition/transition';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  
  @ViewChild('navTabs') _tabsRef: Tabs;

  tab1Root = HomePage;
  tab2Root = UserAccountPage;
  tab3Root = BoardsPage;

  constructor(
    private userData: UserDataProvider,
    public transition:TransitionProvider,
    public events: Events) {

  }

  ionViewDidLoad() {
    // Subscribe to TransitionNavTab event from Transition provider
    this.events.subscribe('transition:navtab', (eventData) => {
      this.SelectTab(eventData.selectedTabIndex);
    });
  }

  private SelectTab(tabIndex){
    if(this._tabsRef) {
      switch(tabIndex)
      {
        case 1: this._tabsRef.select(1); break;
        case 2: this._tabsRef.select(2); break;
        default: this._tabsRef.select(0); break;
      }
    }
  }

  ShouldShowTabs() {
    return this.userData.IsLoggedIn();
  }
}
