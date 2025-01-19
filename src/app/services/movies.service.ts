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
  },
  {
    id: 2,
    title: 'Code Geass',
    overview: 'Rebellion, strategy, betrayal, mechas, Geass, revolution.',
    posterUrl: 'https://www.pixelstalk.net/wp-content/uploads/2016/05/HD-Code-Geass-Wallpapers.jpg',
    rating: 10
  },
  {
    id: 3,
    title: 'Inception',
    overview: 'A thief who steals corporate secrets through use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
    posterUrl: 'https://static1.moviewebimages.com/wordpress/wp-content/uploads/movie/i0DBDLhuWiY4ue0we5ebwb0W6gxRJF.jpg',
    rating: 9
  },
  {
    id: 4,
    title: 'Interstellar',
    overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
    rating: 10
  },
  {
    id: 5,
    title: 'Death Note',
    overview: 'Young Japanese student gets hands to the Death Note',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNjRiNmNjMmMtN2U2Yi00ODgxLTk3OTMtMmI1MTI1NjYyZTEzXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
    rating: 8
  },
  {
    id: 6,
    title: 'Naruto Shippuden',
    overview: 'Naruto Uzumaki and his comrades return to Konohagakure to stop the rogue ninja.',
    posterUrl: 'https://wallpapercave.com/wp/wp8840621.jpg',
    rating: 9
  }
];
@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private defaultMoviesKey = 'defaultMovies';
  private addedMoviesKey = 'addedMovies';
  private defaultMovies: Movie[] = DEFAULT_MOVIES;
  private addedMovies: Movie[] = this.loadAddedMovies();
  private moviesSubject = new BehaviorSubject<Movie[]>([...this.defaultMovies, ...this.addedMovies]);
  private nextId: number = this.getNextId();

  constructor() {
    // Initialize default movies if not already present
    this.initializeDefaultMovies();
  }

  /**
   * Initializes default movies in localStorage if not already present.
   */
  private initializeDefaultMovies(): void {
    const data = localStorage.getItem(this.defaultMoviesKey);
    if (!data) {
      localStorage.setItem(this.defaultMoviesKey, JSON.stringify(this.defaultMovies));
    }
  }

  /**
   * Loads added movies from localStorage.
   * @returns An array of added movies.
   */
  private loadAddedMovies(): Movie[] {
    const data = localStorage.getItem(this.addedMoviesKey);
    if (data) {
      try {
        return JSON.parse(data) as Movie[];
      } catch (error) {
        console.error('Error parsing added movies from Local Storage:', error);
        return [];
      }
    }
    return [];
  }

  /**
   * Saves added movies to localStorage.
   * @param movies The array of added movies to save.
   */
  private saveAddedMovies(movies: Movie[]): void {
    localStorage.setItem(this.addedMoviesKey, JSON.stringify(movies));
  }

  /**
   * Determines the next unique ID based on all movies.
   * @returns The next unique ID.
   */
  private getNextId(): number {
    const allMovies = [...this.defaultMovies, ...this.addedMovies];
    if (allMovies.length === 0) return 1;
    return Math.max(...allMovies.map(movie => movie.id)) + 1;
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
   * Adds a new movie to the added movies array and updates subscribers.
   * @param movieData The data of the movie to add (excluding the ID).
   * @returns An Observable of the created movie.
   */
  createMovie(movieData: Omit<Movie, 'id'>): Observable<Movie> {
    const newMovie: Movie = {
      id: this.nextId++,
      ...movieData
    };
    this.addedMovies.push(newMovie);
    this.saveAddedMovies(this.addedMovies);
    this.moviesSubject.next([...this.defaultMovies, ...this.addedMovies]); // Emit updated list
    return of(newMovie);
  }

  /**
   * Deletes a movie by its ID from the added movies array.
   * @param id The ID of the movie to delete.
   * @returns An Observable indicating whether the deletion was successful.
   */
  deleteMovie(id: number): Observable<boolean> {
    const index = this.addedMovies.findIndex(movie => movie.id === id);
    if (index !== -1) {
      this.addedMovies.splice(index, 1);
      this.saveAddedMovies(this.addedMovies);
      this.moviesSubject.next([...this.defaultMovies, ...this.addedMovies]); // Emit updated list
      return of(true);
    }
    return of(false);
  }

  /**
   * Updates an existing movie in the added movies array.
   * @param updatedMovie The movie data with updated fields.
   * @returns An Observable of the updated movie or undefined if not found.
   */
  updateMovie(updatedMovie: Movie): Observable<Movie | undefined> {
    const index = this.addedMovies.findIndex(movie => movie.id === updatedMovie.id);
    if (index !== -1) {
      this.addedMovies[index] = updatedMovie;
      this.saveAddedMovies(this.addedMovies);
      this.moviesSubject.next([...this.defaultMovies, ...this.addedMovies]); // Emit updated list
      return of(updatedMovie);
    }
    return of(undefined);
  }
}
