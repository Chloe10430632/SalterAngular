import { NgClass } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-header',
  imports: [NgClass],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isForumActive: boolean = true;
  isTripActive: boolean = false;
  isHouseActive: boolean = false;
  isExperienceActive: boolean = false;

  btnForumActive() {
    this.isForumActive = true;
    this.isTripActive = false;
    this.isHouseActive = false;
    this.isExperienceActive = false;
  }

  btnTripActive() {
    this.isForumActive = false;
    this.isTripActive = true;
    this.isHouseActive = false;
    this.isExperienceActive = false;
  }

  btnHouseActive() {
    this.isForumActive = false;
    this.isTripActive = false;
    this.isHouseActive = true;
    this.isExperienceActive = false;
  }

  btnExperienceActive() {
    this.isForumActive = false;
    this.isTripActive = false;
    this.isHouseActive = false;
    this.isExperienceActive = true;
  }

}

