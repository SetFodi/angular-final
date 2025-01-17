import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MoviesService } from '../../services/movies.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent {
  movieForm: FormGroup;

  constructor(private fb: FormBuilder, private moviesService: MoviesService) {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      overview: ['', Validators.required],
      posterUrl: ['', Validators.required],
      rating: [0, Validators.required]
    });
  }

  submitMovie() {
    if (this.movieForm.valid) {
      this.moviesService.createMovie(this.movieForm.value).subscribe({
        next: (res) => {
          alert('Movie created successfully');
          this.movieForm.reset();
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }
}
