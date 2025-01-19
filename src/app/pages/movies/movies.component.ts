// src/app/components/movies/movies.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesService, Movie } from '../../services/movies.service';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit, OnDestroy {
  movies: Movie[] = [];
  errorMessage?: string;
  loading: boolean = true;
  private moviesSubscription!: Subscription;

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.fetchMovies();
  }

  fetchMovies(): void {
    this.moviesSubscription = this.moviesService.getMovies().subscribe({
      next: (res) => {
        this.movies = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load movies. Please try again later.';
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.moviesSubscription) {
      this.moviesSubscription.unsubscribe();
    }
  }
}
