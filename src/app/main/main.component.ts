import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import {NavbarService} from '../navbar/navbar.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  posts: any = [];

  constructor(private mainService: MainService, private navbarService: NavbarService) { }

  ngOnInit() {
    const result = this.mainService.getAllPosts();
    this.navbarService.show();

    if (result !== null) {
      result.subscribe(
        posts => {
          this.posts = posts;
        }
      );
    }
  }

}
