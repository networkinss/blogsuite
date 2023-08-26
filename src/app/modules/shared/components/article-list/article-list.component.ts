import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog/blog.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-article-list',
    templateUrl: './article-list.component.html',
    styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {
    articles$!: Observable<{ results: article[] }> | undefined;

    constructor(
        private blogService: BlogService
    ) {
    }


    ngOnInit(): void {
        this.articles$ = this.blogService.getBlogItems();
    }

}

export interface article{
    title: string,
    description: string,
    slug: string,
    author: string
}
