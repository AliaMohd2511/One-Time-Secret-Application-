import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SecretResponse } from './secret-response.model'; 

@Injectable({
  providedIn: 'root'
})
export class SecretService {
  private apiUrl = 'http://localhost:3000/api/secrets';  // Use the backend service name

  constructor(private http: HttpClient) { }

  createSecret(secret: string, passphrase: string, expirationInDays: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { secret, passphrase, expirationInDays });
  }

  getSecret(uuid: string): Observable<SecretResponse> {
      return this.http.get<SecretResponse>(`${this.apiUrl}/${uuid}`);
  }

// secret.service.ts
burnSecret(uuid: string, passphrase: string | null) {
  return this.http.delete(`${this.apiUrl}/burn/${uuid}`, {
    body: { passphrase } // Include passphrase in the request body
  });
}

// Optional: Method to verify passphrase for a secret (if you want to handle passphrase validation separately)
verifyPassphrase(uuid: string, passphrase: string): Observable<{ secret: string }> {
  return this.http.post<{ secret: string }>(`${this.apiUrl}/verify-passphrase/${uuid}`, { passphrase });
  }

checkIfSecretAccessed(uuid: string) {
  return this.http.get<{ accessed: boolean }>(`http://localhost:3000/api/secrets/${uuid}/accessed`);
}

}
