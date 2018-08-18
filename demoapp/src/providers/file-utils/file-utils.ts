import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


@Injectable()
export class FileUtilsProvider {

  constructor(private storage:Storage) {
    
  }

  public SaveDataToLocalStorage(storageKey, customData)
  {
    //try{
      this.storage.ready().then(() => {
        this.storage.set(storageKey, JSON.stringify(customData));
      }, (reason) => {
        console.log(reason);
      });
    /* } catch(e)
    {
      console.log("Unable to save data to local storage!");
    } */
  }

  public LoadDataFromLocalStorage(storageKey)
  {
    return new Promise((resolve, reject) => {
      let localData:any = null;

      this.storage.get(storageKey).then((val) => {
        if(val != null){
          localData = JSON.parse(val);
        }
        resolve(localData);
      }, (reason) => {
        reject(localData);
      });
    });
  }

  public ClearDataFromLocalStorage(storageKey)
  {
    return new Promise((resolve, reject) => {
      this.storage.remove(storageKey).then((value) => {
        resolve();
      }, (reason) => {
        reject();
      });
    });
  }
}
