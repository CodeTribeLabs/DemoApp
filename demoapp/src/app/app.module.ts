import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { MomentModule } from 'angular2-moment';
import { LinkyModule } from 'angular-linky';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { WelcomePage } from '../pages/welcome/welcome';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { UserAppsPage } from '../pages/user-apps/user-apps';
import { SearchAppsPage } from '../pages/search-apps/search-apps';
import { SearchBoardsPage } from '../pages/search-boards/search-boards';
import { AppInfoPage } from '../pages/app-info/app-info';
import { AppPlayPage } from '../pages/app-play/app-play';
import { UserAccountPage } from '../pages/user-account/user-account';

import { BoardsPage } from '../pages/boards/boards';
import { FeedsPage } from '../pages/feeds/feeds';
import { FaqPage } from '../pages/faq/faq';
import { PrivacyPage } from '../pages/privacy/privacy';
import { TermsPage } from '../pages/terms/terms';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AppDataProvider } from '../providers/app-data/app-data';
import { UserDataProvider } from '../providers/user-data/user-data';
import { WebServiceProvider } from '../providers/web-service/web-service';
import { TransitionProvider } from '../providers/transition/transition';
import { FileUtilsProvider } from '../providers/file-utils/file-utils';
import { BrowserUtilsProvider } from '../providers/browser-utils/browser-utils';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,

    WelcomePage,
    SignUpPage,
    UserAppsPage,
    SearchAppsPage,
    SearchBoardsPage,
    AppInfoPage,
    AppPlayPage,
    UserAccountPage,
    BoardsPage,
    FeedsPage,
    FaqPage,
    PrivacyPage,
    TermsPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MomentModule,
    LinkyModule,
    IonicModule.forRoot(MyApp),
    //IonicStorageModule.forRoot()
    IonicStorageModule.forRoot({ name: '__gtlocaldb', driverOrder: ['sqlite', 'websql', 'indexeddb'] })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,

    WelcomePage,
    SignUpPage,
    UserAppsPage,
    SearchAppsPage,
    SearchBoardsPage,
    AppInfoPage,
    AppPlayPage,
    UserAccountPage,
    BoardsPage,
    FeedsPage,
    FaqPage,
    PrivacyPage,
    TermsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    InAppBrowser,
    AppDataProvider,
    UserDataProvider,
    WebServiceProvider,
    TransitionProvider,
    FileUtilsProvider,
    BrowserUtilsProvider,
    WebServiceProvider
  ]
})
export class AppModule {}
