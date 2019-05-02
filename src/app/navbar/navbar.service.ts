import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../user/user';


@Injectable({
  providedIn: 'root'
})
export class NavbarService {


  private links = new Array<{ text: string, path: string, param: string }>();
  private isLoggedIn = new Subject<boolean>();
  visible: boolean;

  constructor() {
    this.isLoggedIn.next(localStorage.getItem('access_token') !== null);
    this.visible = true;

    const user: User = JSON.parse(localStorage.getItem('current_user'));
    if (!user) {
      return;
    }

    const self = this;
    user.subjects.forEach(function (subject) {
      self.addItem({text: subject.name, path: '/subjects', param: subject._id});
    });

    console.log(user);
  }

  hide() { this.visible = false; }

  show() { this.visible = true; }

  getLinks() {
    return this.links;
  }

  getLoginStatus() {
    this.updateLoginStatus(localStorage.getItem('access_token') !== null);
    this.isLoggedIn.next(localStorage.getItem('access_token') !== null);
    return this.isLoggedIn;
  }

  updateLoginStatus(status: boolean) {
    this.isLoggedIn.next(status);

    if (!status) {
      this.clearAllItems();
      this.addItem({ text: 'Login', path: 'login', param: '' });
    }
  }

  updateNavAfterAuth(): void {
    this.removeItem({ text: 'Login' });
  }

  addItem({ text, path, param }) {
    this.links.push({ text: text, path: path, param: param });
  }

  removeItem({ text }) {
    this.links.forEach((link, index) => {
      if (link.text === text) {
        this.links.splice(index, 1);
      }
    });
  }

  clearAllItems() {
    this.links.length = 0;
  }
}
