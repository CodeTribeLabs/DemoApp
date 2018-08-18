import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

import { WebServiceProvider } from '../../providers/web-service/web-service';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { TransitionProvider } from '../../providers/transition/transition';

/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  // This is bound to the form fields using two-way binding (ngModel)
  _formData = {"email":"","firstname":"","lastname":"","password":"","password2":""};
  _responseData:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private webService: WebServiceProvider,
    private userData: UserDataProvider,
    private transition:TransitionProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  OnSubmitClick(){
    
    // Validate the form fields;
    let validationError = "";

    if(this._formData.email) {
      if(this._formData.firstname) {
        if(this._formData.password) {
          if(this._formData.password2) {
            if(this._formData.password == this._formData.password2){
              this.SubmitForm();
            } else {
              validationError = "Oops! The passwords that you have entered are not the same.";
            }
          }
          else{
            validationError = "Oops! Repeat Password field is mandatory.";
          }
        }
        else{
          validationError = "Oops! New Password field is mandatory.";
        }
      }
      else{
        validationError = "Oops! First Name field is mandatory.";
      }
    }
    else{
      validationError = "Oops! Email field is mandatory.";
    }

    if(validationError){
      this.transition.ShowToast(validationError);
    }
    
  }

  SubmitForm() {
    this.transition.ShowLoader("");

    this.webService.Register(this._formData.email, this._formData.firstname, this._formData.lastname, this._formData.password)
      .then((result) => {
        this._responseData = result;
        console.log(this._responseData);

        this.transition.HideLoader();

        if(this._responseData.acctId)
        { // If request was successful
          console.log("REGISTRATION COMPLETED");
          this.userData.SetUserProfile(this._responseData);
          
          this.navCtrl.push(TabsPage);
        } else {
          this.transition.ShowToast("Sorry, we are unable to complete your registration now. Please try again later.");
        }
      }, (err) => {
        console.log("Connection Failed");
        this.transition.HideLoader();
        this.transition.ShowToast("Unable to reach the server. Please check your internet connection.");
      });
  }



}
