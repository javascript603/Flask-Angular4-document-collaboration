import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './app.service';
import { Subject } from 'rxjs/Subject';
import * as io from 'socket.io-client';

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
  send_flag = true;
  temp_content = '';



  editorConfig = {
    editable: true,
    spellcheck: false,
    height: '90vh',
    minHeight: '5rem',
    placeholder: '',
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

    this.socket.emit('my_event', {data: 'I just connected'});
    this.socket.on('my_response', (data) => {
      if (data.senderid !== this.socket.id) {
        console.log(`You seceived message from others *** ${data.data} ***, :  Sender : ${data.senderid}, Receiver: ${this.socket.id}`);
        this.temp_content = data.data.slice(0);
        if (this.temp_content.length === data.len) {
          this.htmlContent = this.temp_content;
        }
      } else {
        console.log(`You seceived message from others *** ${data.data} ***, :  Sender : ${data.senderid}, Receiver: ${this.socket.id}`);
      }
    });
    this.getLatestRelease();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  changeEvent() {
    if ( this.send_flag === true) {
      this.send_flag = false;
      setTimeout(() => {
        this.socket.emit('my_event', {data : this.htmlContent, len : this.htmlContent.length, senderid : this.socket.id});
        this.send_flag = true;
      }, 1000);

    }
  }

}
