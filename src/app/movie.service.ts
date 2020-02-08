import { Injectable } from '@angular/core';
//import { fakeMovies } from './fake-movies';
import { Movie } from './../models/movie';

import { Observable, of, from } from 'rxjs';
import { MessageService } from './message.service';
//fetch data from service
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, map, tap } from 'rxjs/operators';

const httpOption={
  headers: new HttpHeaders({'Content-Type': 'application/json'})//kiểu dữ liệu gửi lên
}
@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private moviesURL = "http://localhost:3000/movies";
  constructor(
    private http: HttpClient,
    public messageService: MessageService
  ) { }

  getMovies(): Observable <Movie[]>{
    //this.messageService.add(`${new Date().toLocaleString()}. Get movie list`);
    //console.log("xuatNT: ", `${new Date().toLocaleString()}`);
    //return of(fakeMovies);
    return this.http.get<Movie[]>(this.moviesURL).pipe(
      tap(receivedMovies => console.log(`receiveMovies = ${JSON.stringify(receivedMovies)}`)),
      catchError(error => of([]))//async => of
      );    
  }

  getMovieFromId(id: number): Observable<Movie>{
    // return of(fakeMovies.find(movie =>{
    //   return movie.id === id;
    // }))
    const url = `${this.moviesURL}/${id}`;
    return this.http.get<Movie>(url).pipe(
      tap(selectedMovie => console.log(`selectedMovie = ${JSON.stringify(selectedMovie)}`)),
      catchError(error => of(new Movie()))//async => of
    );  
  }

  updateMovie(movie: Movie): Observable<any>{ //output là kiểu dữ liệu bất kỳ    
    return this.http.put(`${this.moviesURL}/${movie.id}`,movie,httpOption).pipe(
      //link, movie cần cập nhật, httpOption kiểu dữ liệu json
      tap(updateMovie => console.log(`updated movie = ${JSON.stringify(updateMovie)}`)),
      catchError(error => of(new Movie()))
    );
  }

  addMovie(newMovie: Movie): Observable<Movie>{
    return this.http.post<Movie>(this.moviesURL, newMovie, httpOption).pipe(
      tap((movie: Movie) => console.log(`inserted movie =${JSON.stringify(movie)}`)),
      catchError(error => of(new Movie))
    )
  }

  deleteMovie(movieId: number): Observable<Movie>{
    const url = `${this.moviesURL}/${movieId}`;
    return this.http.delete<Movie>(url, httpOption).pipe(
      tap(_ => console.log(`Deleted movie with id = ${movieId}`)),
      catchError(error => of(null))
    )
  }

  searchMovies(typedString: string): Observable<Movie[]>{//observable: quan sát sự thay đổi
    //nếu thanh đổi chạy vào thân hàm
    //if user type "" => no movie found
    if(!typedString.trim()){
      return of([]);
    }

    return this.http.get<Movie[]>(`${this.moviesURL}?name_like=${typedString}`).pipe(
      tap(foundedMovies => console.log(`founded movies = ${JSON.stringify(foundedMovies)}`)),
      catchError(error => of(null))
    );
  }
}
