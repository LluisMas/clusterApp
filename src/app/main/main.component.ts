import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  posts: any = [];

  constructor(private mainService: MainService) { }

  ngOnInit() {
    const result = this.mainService.getAllPosts();

    if (result !== null) {
      result.subscribe(
        posts => {
          this.posts = posts;
        }
      );
    }
  }

}
