import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/User';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private HttpClient: HttpClient
  ) { }

  getAllUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.HttpClient.get(`${environment.apiEndereco}/Usuario`).subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  getUsers(): Observable<User[]> {
    return this.HttpClient.get<User[]>(`${environment.apiEndereco}/Usuario`);
  }

  postUser(user: User): Observable<User> {
    return this.HttpClient.post<User>(`${environment.apiEndereco}/Usuario`, user);
  }

  editUser(user: User): Observable<User> {
    return this.HttpClient.put<User>(`${environment.apiEndereco}/Usuario`, user);
  }

  deleteUser(id: number): Observable<User> {
    return this.HttpClient.delete<User>(`${environment.apiEndereco}/Usuario/${id}`);
  }

}