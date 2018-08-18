import { Component } from '@angular/core';
import { Platform, App, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { UserDataProvider } from '../providers/user-data/user-data';
import { TransitionProvider } from '../providers/transition/transition';

//import { TabsPage } from '../pages/tabs/tabs';
import { WelcomePage } from '../pages/welcome/welcome';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
//import { UserAccountPage } from '../pages/user-account/user-account';
import { FaqPage } from '../pages/faq/faq';
import { PrivacyPage } from '../pages/privacy/privacy';
import { TermsPage } from '../pages/terms/terms';

@Component({
  templateUrl: 'app.html'//,
})
export class MyApp {
  rootPage:any = WelcomePage;
  //rootPage:any = TabsPage;

  constructor(
    public platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    private app: App,
    private menuCtrl: MenuController,
    private userData: UserDataProvider,
    private transition: TransitionProvider) {
    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ShouldShowSplitPane()
  {
    return (this.userData.IsLoggedIn() && this.userData.HasActivated() && this.platform.width() > 768);
  }

  OnMenuClick(menuId) {
    this.menuCtrl.close();

    switch(menuId) {
      case "GAMES": this.transition.NavToTabIndex(0); break;
      case "PROFILE": this.transition.NavToTabIndex(1); break;
      case "BOARD": this.transition.NavToTabIndex(2); break;
      case "TOPICS": break;
      case "FEEDS": break;
      case "LOGOUT": this.Logout(); break;

      //case "ACCOUNT": this.PushPage(UserAccountPage); break;
      case "ABOUT": this.PushPage(AboutPage); break;
      case "CONTACT": this.PushPage(ContactPage); break;
      case "FAQ": this.PushPage(FaqPage); break;
      case "PRIVACY": this.PushPage(PrivacyPage); break;
      case "TERMS": this.PushPage(TermsPage); break;
      
      default: console.log("Unhandled menu action: " + menuId); break;
    }
  }

  SetRootPage(targetPage)
  {
    this.app.getActiveNavs()[0].setRoot(targetPage);
    this.app.getActiveNavs()[0].popToRoot();
    //let root = this.app.getActiveNavs()[0];
    //root.setRoot(WelcomePage);
    //root.popToRoot();
  }

  PushPage(targetPage)
  {
    this.app.getActiveNavs()[0].push(targetPage);
  }

  Logout()
  {
    // Clear the local UserData asynchronously
    this.userData.ClearProfile()
    .then((result) => {
      
      // Set WelcomePage as the root page and navigate back to it
      this.SetRootPage(WelcomePage);
      
      // Hide the Split Pane Menu
      this.menuCtrl.enable(false);

      console.log("Logout");
    }, (err) => {
      console.log("Logout failed!");
    });
  }
}
