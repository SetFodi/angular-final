import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private baseUrl = 'http://localhost:8000/api'; // Laravel endpoint

  constructor(private http: HttpClient) {}

  getMovies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/movies`);
  }

  getMovieById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/movies/${id}`);
  }

  // If admin can create a new movie
  createMovie(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/movies`, data);
  }

  // etc. for update/delete
}
