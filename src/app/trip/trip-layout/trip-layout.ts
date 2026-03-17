import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../components/sidebar/sidebar';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-trip-layout',
  imports: [RouterOutlet, Sidebar, Footer],
  templateUrl: './trip-layout.html',
  styleUrl: './trip-layout.css'
})
export class TripLayout { }
