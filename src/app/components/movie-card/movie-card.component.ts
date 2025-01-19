import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Movie } from '../../services/movies.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  isOverlayVisible: boolean = false;

  /* Event Listeners for Mouse and Keyboard Interactions */

  @HostListener('mouseenter')
  onMouseEnter() {
    this.isOverlayVisible = true;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isOverlayVisible = false;
  }

  @HostListener('focusin')
  onFocusIn() {
    this.isOverlayVisible = true;
  }

  @HostListener('focusout')
  onFocusOut() {
    this.isOverlayVisible = false;
  }
}
