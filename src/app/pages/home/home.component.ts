// src/app/components/home/home.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router) {}

  // This method is called by the button in your home.component.html
  goToMovies() {
    // Navigate to the '/movies' page (or wherever you want)
    this.router.navigate(['/movies']);
  }
}
