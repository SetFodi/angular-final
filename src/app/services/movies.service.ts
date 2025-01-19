// movies.service.ts
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

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private localStorageKey = 'moviesData';
  private movies: Movie[] = this.loadMovies();
  private nextId: number = this.getNextId();
  private moviesSubject = new BehaviorSubject<Movie[]>(this.movies);

  constructor() {}

  private loadMovies(): Movie[] {
    const data = localStorage.getItem(this.localStorageKey);
    if (data) {
      try {
        return JSON.parse(data) as Movie[];
      } catch (error) {
        console.error('Error parsing movies from Local Storage:', error);
        return this.defaultMovies();
      }
    }
    return this.defaultMovies();
  }

  private defaultMovies(): Movie[] {
    return [
      {
        id: 1,
        title: 'The Matrix',
        overview: 'A computer hacker learns about the true nature of reality...',
        posterUrl: 'https://imgc.allpostersimages.com/img/posters/naxart-the-matrix-neo_u-l-q1qih2d0.jpg?artHeight=550&artPerspective=n&artWidth=550&background=ffffff',
        rating: 9
      }
    ];
  }

  private getNextId(): number {
    if (this.movies.length === 0) return 1;
    return Math.max(...this.movies.map(movie => movie.id)) + 1;
  }

  private saveMovies(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.movies));
  }

  /**
   * Return an Observable of the current movies array.
   * Any subscriber will be notified when we add new movies.
   */
  getMovies(): Observable<Movie[]> {
    return this.moviesSubject.asObservable();
  }

  /**
   * Find a movie by ID, but return an Observable so we can .subscribe()
   */
  getMovieById(id: number): Observable<Movie | undefined> {
    return this.getMovies().pipe(
      map((movies) => movies.find((m) => m.id === id))
    );
  }

  /**
   * Add a new movie to our array and notify subscribers.
   * Return an Observable of the created movie.
   */
  createMovie(movieData: Omit<Movie, 'id'>): Observable<Movie> {
    const newMovie: Movie = {
      id: this.nextId++,
      ...movieData
    };
    this.movies.push(newMovie);
    this.saveMovies();
    this.moviesSubject.next([...this.movies]);
    return of(newMovie);
  }

  /**
   * Optional: Method to delete a movie by ID
   */
  deleteMovie(id: number): Observable<boolean> {
    const index = this.movies.findIndex(movie => movie.id === id);
    if (index !== -1) {
      this.movies.splice(index, 1);
      this.saveMovies();
      this.moviesSubject.next([...this.movies]);
      return of(true);
    }
    return of(false);
  }

  /**
   * Optional: Method to update a movie
   */
  updateMovie(updatedMovie: Movie): Observable<Movie | undefined> {
    const index = this.movies.findIndex(movie => movie.id === updatedMovie.id);
    if (index !== -1) {
      this.movies[index] = updatedMovie;
      this.saveMovies();
      this.moviesSubject.next([...this.movies]);
      return of(updatedMovie);
    }
    return of(undefined);
  }
}
