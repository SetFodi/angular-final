// admin.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MoviesService } from '../../services/movies.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  movieForm: FormGroup;
  successMessage?: string;
  errorMessage?: string;
  posterUrl?: string; // For image preview
  isImageValid: boolean = true; // To handle image load errors

  constructor(
    private fb: FormBuilder,
    private moviesService: MoviesService
  ) {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      overview: ['', Validators.required],
      posterUrl: ['', [Validators.required, Validators.pattern(/^(ftp|http|https):\/\/[^ "]+$/)]],
      rating: [0, [Validators.required, Validators.min(0), Validators.max(10)]]
    });
  }

  submitMovie() {
    if (this.movieForm.valid && this.isImageValid) {
      this.moviesService.createMovie(this.movieForm.value).subscribe({
        next: (newMovie) => {
          this.successMessage = 'Movie created successfully!';
          this.errorMessage = undefined;
          this.movieForm.reset();
          // Optionally, reset the rating to 0 after reset
          this.movieForm.patchValue({ rating: 0 });
          this.posterUrl = undefined;
          this.isImageValid = true;
          // Remove the success message after a few seconds
          setTimeout(() => {
            this.successMessage = undefined;
          }, 5000);
        },
        error: (err) => {
          this.errorMessage = err.message || 'An error occurred while adding the movie.';
          this.successMessage = undefined;
        }
      });
    } else {
      // Mark all controls as touched to trigger validation messages
      this.movieForm.markAllAsTouched();
      if (!this.isImageValid) {
        this.errorMessage = 'Poster image failed to load. Please check the URL.';
      }
    }
  }

  onPosterUrlChange(): void {
    const url = this.movieForm.get('posterUrl')?.value;
    this.posterUrl = url;
    this.isImageValid = true; // Reset image validity
    this.errorMessage = undefined; // Clear previous errors
  }

  onImageError(): void {
    this.isImageValid = false;
    this.posterUrl = undefined;
    this.errorMessage = 'Invalid poster URL. Please provide a valid image URL.';
  }
}
