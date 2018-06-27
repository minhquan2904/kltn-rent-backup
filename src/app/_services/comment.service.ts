import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Comment } from '../_models/index';
@Injectable()
export class CommentService {
    constructor(private http: Http) { }

    findByMotel(id) {
       return new Promise((resolve, reject) => {
            this.http.get('/comment/find-by-motel/' + id)
              .map(res => res.json())
              .subscribe(res => {
                resolve(res);
            }, (err) => {
              reject(err);
            });
        });
    }
    findByStatus(stt): Observable<Comment[]> {
        return this.http.get('/comment/find-by-status/' + stt)
            .map(res => {
                return res.json().map(item => {
                    return new Comment(
                        item._id,
                        item.customer_id,
                        item.customer_name,
                        item.customer_level,
                        item.content,
                        item.status,
                        item.motel_id,
                        item.created_at
                    );
                });
            });
    }
    comment(data) {
        return this.http.post('/comment/insert', data);
    }
    update(id, data) {
        return this.http.put('/comment/' + id, data);
       }
    _delete(id) {
        return this.http.delete('/comment/' + id);
    }
}
