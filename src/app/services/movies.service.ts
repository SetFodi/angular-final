// src/app/services/movies.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  rating: number;
}

// Define default movies as a constant
const DEFAULT_MOVIES: Movie[] = [
  {
    id: 1,
    title: 'The Matrix',
    overview: 'A computer hacker learns about the true nature of reality...',
    posterUrl: 'https://imgc.allpostersimages.com/img/posters/naxart-the-matrix-neo_u-l-q1qih2d0.jpg?artHeight=550&artPerspective=n&artWidth=550&background=ffffff',
    rating: 9
  }
  // You can add more default movies here
];

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private localStorageKey = 'moviesData'; // Key for storing all movies
  private movies: Movie[] = this.loadMovies();
  private nextId: number = this.getNextId();
  private moviesSubject = new BehaviorSubject<Movie[]>(this.movies);

  constructor() {}

  /**
   * Loads movies from localStorage.
   * If no data exists, initializes with DEFAULT_MOVIES and saves to localStorage.
   * @returns An array of movies.
   */
  private loadMovies(): Movie[] {
    const data = localStorage.getItem(this.localStorageKey);
    if (data) {
      try {
        return JSON.parse(data) as Movie[];
      } catch (error) {
        console.error('Error parsing movies from Local Storage:', error);
        return DEFAULT_MOVIES;
      }
    } else {
      this.saveMovies(DEFAULT_MOVIES);
      return DEFAULT_MOVIES;
    }
  }

  /**
   * Determines the next unique ID based on the current movies list.
   * @returns The next unique ID.
   */
  private getNextId(): number {
    if (this.movies.length === 0) return 1;
    return Math.max(...this.movies.map(movie => movie.id)) + 1;
  }

  /**
   * Saves the current movies list to localStorage.
   * @param movies The array of movies to save.
   */
  private saveMovies(movies: Movie[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(movies));
  }

  /**
   * Returns an Observable of the current movies array.
   * Subscribers will be notified whenever the movies list changes.
   */
  getMovies(): Observable<Movie[]> {
    return this.moviesSubject.asObservable();
  }

  /**
   * Finds a movie by its ID.
   * @param id The ID of the movie to find.
   * @returns An Observable of the found movie or undefined.
   */
  getMovieById(id: number): Observable<Movie | undefined> {
    return this.getMovies().pipe(
      map((movies) => movies.find((m) => m.id === id))
    );
  }

  /**
   * Adds a new movie to the movies array and updates subscribers.
   * @param movieData The data of the movie to add (excluding the ID).
   * @returns An Observable of the created movie.
   */
  createMovie(movieData: Omit<Movie, 'id'>): Observable<Movie> {
    const newMovie: Movie = {
      id: this.nextId++,
      ...movieData
    };
    this.movies.push(newMovie);
    this.saveMovies(this.movies);
    this.moviesSubject.next([...this.movies]); // Emit updated list
    return of(newMovie);
  }

  /**
   * Deletes a movie by its ID from the movies array.
   * @param id The ID of the movie to delete.
   * @returns An Observable indicating whether the deletion was successful.
   */
  deleteMovie(id: number): Observable<boolean> {
    const index = this.movies.findIndex(movie => movie.id === id);
    if (index !== -1) {
      this.movies.splice(index, 1);
      this.saveMovies(this.movies);
      this.moviesSubject.next([...this.movies]); // Emit updated list
      return of(true);
    }
    return of(false);
  }

  /**
   * Updates an existing movie in the movies array.
   * @param updatedMovie The movie data with updated fields.
   * @returns An Observable of the updated movie or undefined if not found.
   */
  updateMovie(updatedMovie: Movie): Observable<Movie | undefined> {
    const index = this.movies.findIndex(movie => movie.id === updatedMovie.id);
    if (index !== -1) {
      this.movies[index] = updatedMovie;
      this.saveMovies(this.movies);
      this.moviesSubject.next([...this.movies]); // Emit updated list
      return of(updatedMovie);
    }
    return of(undefined);
  }
}
