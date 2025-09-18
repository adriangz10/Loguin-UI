import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5201/api/auth'; // TODO: Update with your backend URL
  private userSubject: BehaviorSubject<any | null>;
  public user: Observable<any | null>;

  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<any | null>(this.getUserFromToken());
    this.user = this.userSubject.asObservable();
  }

  private getUserFromToken(): any | null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          if (decodedToken.exp * 1000 > Date.now()) {
            return decodedToken;
          }
        } catch (error) {
          return null;
        }
      }
    }
    return null;
  }

  public get userValue(): any | null {
    return this.userSubject.value;
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.token);
        }
        const decodedToken = this.getUserFromToken();
        this.userSubject.next(decodedToken);
      })
    );
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    this.userSubject.next(null);
  }

  public getRole(): string | null {
    const user = this.userValue;
    return user ? user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] : null;
  }

  public isAuthenticated(): boolean {
    return !!this.userValue;
  }
}
