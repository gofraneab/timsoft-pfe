import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Signature } from '../models/signature';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {
  private apiUrl = 'http://localhost:5271/api/Signatures';

  constructor(private http: HttpClient ) { }
  getAll() :Observable<Signature[]> {
    return this.http.get<Signature[]>(this.apiUrl);
  }
  getById(id: number): Observable<Signature> {
    return this.http.get<Signature>(`${this.apiUrl}/${id}`);
  }
  getActiveByDepartment(departmentId: number): Observable<Signature[]> {
    return this.http.get<Signature[]>(`${this.apiUrl}/department/${departmentId}/active`);
  }
  create(signature: Partial<Signature>): Observable<any> {
    return this.http.post<Signature>(this.apiUrl, signature);
  }
   update(id: number, signature: Partial<Signature>): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, signature, { responseType: 'text' });
}

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
