import { Component, OnInit } from '@angular/core';
import { Subject, of, observable, Observable } from 'rxjs';
//subject: liên tục có string nhét vào stream

import {
  debounceTime,//min time in "ms" to send request(giữa 2 lần gõ)
  distinctUntilChanged,//do not send request if"next string" = "previous string"
  switchMap
} from 'rxjs/operators';

import { Movie } from '../../models/movie';
import {MovieService} from '../movie.service';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css']
})
export class MovieSearchComponent implements OnInit {
  //$="asynchoronous pipe" = asyncPipe
  //chạy theo 1 tiến trình riêng khi mà dữ liệu gửi lên server để lấy kết quả vẫn gõ
  //được các text tiếp theo
  movies$: Observable<Movie[]>;

  //đối tưởng để quản lý stream, kiểu dữ liệu subject
  //"typed strings" is added to Subject, or "stream"
  private searchedSubject = new Subject<string>();

  constructor(private movieService: MovieService) { }

  search(searchedString: string): void{
    console.log(`searchedString = ${searchedString}`);
    //khi gõ 1 ký tự thì ký tự đó sẽ được đẩy dần vào trong stream để xữ lý, xử lý bất đồng bộ 
    // vẫn tiếp nhận text gõ, không bị giật
    //add "typed string" to "stream" to process
    this.searchedSubject.next(searchedString);
  }
  ngOnInit() {
    this.movies$ = this.searchedSubject.pipe(
      //wait 300ms after each keystroke before considering the searched string
      //để số lượng gửi request đến service không quá nhiều
      debounceTime(300),
      //ignore new string if same as previous string
      //khi gõ dữ liệu trước và sau giống nhau thì không lấy dữ liệu nữa
      distinctUntilChanged(),
    //thực hiện công việc lấy dữ liệu đổ vào searchMovie
      switchMap((searchedString: string) => this.movieService.searchMovies(searchedString))
    );
  }

}
