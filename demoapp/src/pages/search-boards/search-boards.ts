import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-search-boards',
  templateUrl: 'search-boards.html',
})
export class SearchBoardsPage {

  _searchQuery: string = '';
  _searchItems: string[];

  _acctId:number = 0;
  _boardListingAll: any;
  _boardListingFiltered: object[] = [];

  constructor(
    public navCtrl: NavController, 
    public viewCtrl: ViewController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    
  }

  ionViewWillEnter() {
    this._boardListingAll = this.navParams.get('boards');
    this._acctId = this.navParams.get('acctId');
    this.RefreshItems();
    this.RefreshFilteredApps();
  }

  OnDismiss() {
    
  }

  private RefreshItems() {

    this._searchItems = [];
    
    this._boardListingAll.forEach(element => {
      this._searchItems.push(element.title); // Push all the board titles
    });

  }

  private RefreshFilteredApps() {

    this._boardListingFiltered = [];

    for (var title of this._searchItems) {
      this._boardListingAll.forEach(element => {
        if(title == element.title){
          this._boardListingFiltered.push(element);
        }
      });
    }
  }

  SearchItems(ev: any) {
    // Reset items back to all of the items
    this.RefreshItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this._searchItems = this._searchItems.filter(
        (item) => {
          return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
        }
      );
    }

    // Refresh the filtered apps based on the App Names inside the _searchItems
    this.RefreshFilteredApps();
  }

  OnBoardClick(board, action) {
    //console.log("Clicked BoardId=" + id + " - " + action);
    this.viewCtrl.dismiss({'id': board.id, 'title': board.title, 'ownerName': board.ownerName, 'action': action});
  }

}
