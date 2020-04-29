import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import {Subject} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RosterService {
  param:any;
  id:any;
  private eventSubject=new Subject<any>();
  db=firebase.firestore();
  players:any;
  roster:Array<any>=[];
  //Need to add players array to template
  rosters_template:Array<any>=[
    {Team: 'default', id: 'default', invCode: 'default'}
  ];


  //event notification
  publishEvent(data: any) {
    this.eventSubject.next(data);
}
getObservable(): Subject<any> {
    return this.eventSubject;
}

  constructor(public router:Router,
    ) {
      var self=this;

      if(firebase.auth().currentUser!=null){
        this.db.collection("roster").where("uid", "==", firebase.auth().currentUser.uid)
       .onSnapshot(function(querySnapshot) {
             console.log("roster list changed...........");
             self.roster = [];
             querySnapshot.forEach(function(doc) {
                 var roster = doc.data();
                 self.roster.push({Team:roster.Team,invCode:roster.invCode,players:roster.players,
                  uid:roster.uid,id:doc.id})
                  self.players=roster.players;
             });

             self.publishEvent({
                 foo: 'bar'
             });

             console.log("items reloaded");
         } );
      }
    }

    refresh(){
      var self=this;
      if(firebase.auth().currentUser!=null){
        this.db.collection("roster").where("uid", "==", firebase.auth().currentUser.uid)
       .onSnapshot(function(querySnapshot) {
        // this.db.collection("roster").where("uid", "==", "sFXHJKC86RVj9A2Qr7IoXlZbgRR2")
        // .onSnapshot(function(querySnapshot) {
             console.log("roster list changed...........");
             self.roster = [];
             querySnapshot.forEach(function(doc) {
              var roster = doc.data();
              self.roster.push({Team:roster.Team,invCode:roster.invCode,players:roster.players,
               uid:roster.uid,id:doc.id})
               self.players=roster.players;
             });

             self.publishEvent({
                 foo: 'bar'
             });

             console.log("items reloaded");
         } );
      }
    }


    getRoster():any{
      var RosterObservable = new Observable(observer => {
        setTimeout(() => {
            observer.next(this.roster);
        }, 1000);
  });
      return RosterObservable;
    }

    getPlayers():any{
      var playersObservable=new Observable(observer =>{
        setTimeout(()=>{
          observer.next(this.players);
        },1000);
      })
      return playersObservable;
    }

    updateStatus(newValues){
      console.log(newValues.id);
      var self=this;
      var db=firebase.firestore();
      db.collection("roster").doc(newValues.id).update(newValues).then(function(){
        console.log("Document successfully updated");
        console.log("Item updated:"+newValues.id);
        self.refresh();
      }).catch(function(error){
        console.error("error removing document: ",error);
      });


    }

    initializeRosters(league_id){
      var self=this;
      var db=firebase.firestore();
      db.collection("leagues").doc(league_id).update(this.rosters_template);
      console.log("Updated " + league_id + "with roster template.")
    }


}

export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.id = childSnapshot.key;
      // console.log(item);
      returnArr.push(item);
  });

  return returnArr;
}
