import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MoviesService, Movie } from '../../services/movies.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movie?: Movie;
  errorMessage?: string;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private moviesService: MoviesService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.params['id'];
    const id = Number(idParam);

    if (isNaN(id)) {
      this.errorMessage = 'Invalid movie ID.';
      this.loading = false;
      return;
    }

    // getMovieById() is an Observable
    this.moviesService.getMovieById(id).subscribe({
      next: (foundMovie) => {
        this.movie = foundMovie;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load movie details. Please try again later.';
        this.loading = false;
      }
    });
  }
}
