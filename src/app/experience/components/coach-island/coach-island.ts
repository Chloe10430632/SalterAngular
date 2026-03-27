import { Component, inject } from '@angular/core';
import { LittleIsland } from "../../myComponents/little-island/little-island";
import { Footer } from "../../../shared/footer/footer";
import { Router } from '@angular/router';
import { Welcome } from "../../myComponents/container/welcome/welcome";
import { Toptab } from "../../myComponents/btn/toptab/toptab";

@Component({
  selector: 'app-coach-island',
  imports: [LittleIsland, Footer, Welcome, Toptab],
  templateUrl: './coach-island.html',
  styleUrl: './coach-island.css',
})
export class CoachIsland {

}

