import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { HomePage } from '../home/home';
import { SignUpPage } from '../sign-up/sign-up';

import { WebServiceProvider } from '../../providers/web-service/web-service';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { TransitionProvider } from '../../providers/transition/transition';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  // This is bound to the form fields using two-way binding (ngModel)
  _formData = {"username":"","password":""};
  _responseData:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private webService: WebServiceProvider,
    private userData: UserDataProvider,
    private transition:TransitionProvider) {

  }

  ionViewDidLoad() {
    this.CheckSession();
  }

  OnLoginClick(){
    this.transition.ShowLoader("");
    this.webService.Login(this._formData.username, this._formData.password)
      .then((result) => {
        this._responseData = result;
        console.log(this._responseData);

        this.transition.HideLoader();

        if(this._responseData.acctId)
        { // If Login was successful
          this.userData.SetUserProfile(this._responseData);
          
          this.navCtrl.push(TabsPage);
          //this.GoToHomePage();
        } else {
          this.transition.ShowToast("Sorry, you have entered an invalid email and password combination.");
        }
      }, (err) => {
        console.log("Connection Failed");
        this.transition.HideLoader();
        this.transition.ShowToast("Unable to reach the server. Please check your internet connection.");
      });
  }

  private CheckSession(){
    // If local UserProfile is already set, proceed to the Home page
    this.transition.ShowLoader("");

    this.userData.LoadProfile()
      .then((userData) => {
        if(userData != null)
        {
          //this.navCtrl.push(TabsPage);
          this.navCtrl.setRoot(TabsPage); // Comment to Hide the Tabbar and just make HomePage the new root page
          this.navCtrl.popToRoot();
          //this.GoToHomePage();
        }
        else{
          //this.navCtrl.setRoot(WelcomePage);
          //this.navCtrl.popToRoot();
          
          console.log("UserProfile not set");
        }

        this.transition.HideLoader();
      }, (err) => {
        console.log("UserProfile not loaded");
        this.transition.HideLoader();
      });
  }

  GoToHomePage(){
    this.navCtrl.setRoot(HomePage);
    this.navCtrl.popToRoot();
  }

  CompleteRegistration(){
    this.navCtrl.setRoot(SignUpPage);
    this.navCtrl.popToRoot();
  }

  OnForgotPasswordClick(){
    
  }

  OnRegisterClick(){
    this.CompleteRegistration();
  }
}
