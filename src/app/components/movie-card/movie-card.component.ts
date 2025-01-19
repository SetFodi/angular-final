// src/app/components/movie-card/movie-card.component.ts
import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Movie, MoviesService } from '../../services/movies.service';
import { AuthService } from '../../services/auth.service';

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

  constructor(private authService: AuthService, private moviesService: MoviesService) {}

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

  /**
   * Checks if the current user is an admin.
   * @returns True if admin, else false.
   */
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  /**
   * Deletes the current movie after confirmation.
   */
  deleteMovie(): void {
    if (confirm(`Are you sure you want to delete "${this.movie.title}"?`)) {
      this.moviesService.deleteMovie(this.movie.id).subscribe({
        next: (success) => {
          if (success) {
            alert('Movie deleted successfully.');
          } else {
            alert('Failed to delete the movie.');
          }
        },
        error: (err) => {
          console.error('Delete Movie Error:', err);
          alert('An error occurred while deleting the movie.');
        }
      });
    }
  }
}
