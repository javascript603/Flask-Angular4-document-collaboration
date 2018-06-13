import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './app.service';
import { Subject } from 'rxjs/Subject';
import * as io from "socket.io-client";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppService]
})

export class AppComponent implements OnInit, OnDestroy {

  title = 'Text Editor';
  latestRelease: any = [];
  private subscription: Subject<any> = new Subject();
  namespace = '/test';
  socket = io('http://localhost:5000');




  editorConfig = {
    editable: true,
    spellcheck: false,
    height: '10rem',
    minHeight: '5rem',
    placeholder: 'Type something. Test the Editor...',
    translate: 'no'
  };

  htmlContent = '';

  /**
   * @param _appService service for app component
   */
  constructor(private _appService: AppService) { }

  getLatestRelease() {
    this.subscription = this._appService.getLatestRelease().subscribe(
      data => this.latestRelease = data[0],
      error => { console.log(error); },
      () => {
        console.log('latest release: ' + this.latestRelease['name']);
      });
  }

  ngOnInit() {
    // this.socket.on('connect', function() {
    //     this.socket.emit('my_event', {data: 'I\'m connected!'});
    // });
    this.socket.emit('my_event', {data: "Hello world"});
    // this.socket.on('test', function (data) {
    //   this.socket.emit('chat', "data");
    // });
    // this.socket.on('updatechat', function (username, data) {
    //     this.socket.emit("test", "Hello world")
    // });

    // this.socket.on('roomcreated', function (data) {
    //   this.socket.emit('adduser', data);
    // });



    this.getLatestRelease();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  changeEvent() {
    this.socket.emit("my_broadcast_event", { data: this.htmlContent })
    this.socket.on('my_response', (data)=>{
      console.log(data)
      this.htmlContent = data.data;
    })
  }

}
