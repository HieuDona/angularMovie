import { Injectable } from '@angular/core';
import { fakeMovies } from './fake-movies';
import { Movie } from './../models/movie';

import { Observable, of, from } from 'rxjs';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(public messageService: MessageService) { }

  getMovies(): Observable <Movie[]>{
    this.messageService.add(`${new Date().toLocaleString()}. Get movie list`);
    console.log("xuatNT: ", `${new Date().toLocaleString()}`);
    return of(fakeMovies);
  }

  getMovieFromId(id: number): Observable<Movie>{
    return of(fakeMovies.find(movie =>{
      return movie.id === id;
    }))
  }

}
