import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SecretService } from '../secret.service';

@Component({
  selector: 'app-generate-secret',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generate-secret.component.html',
  styleUrls: ['./generate-secret.component.css']
})
export class GenerateSecretComponent {
  secret: string = '';          
  passphrase: string = '';       
  expirationInDays: string = '7 days'; 

  constructor(private secretService: SecretService, private router: Router) {}

  createSecret() {
    if (this.secret) {      
      this.secretService.createSecret(this.secret, this.passphrase, this.expirationInDays)
        .subscribe((response) => {
          const uuid = response.uuid;
          const secretLink = `http://localhost:4200/retrieve-secret/${uuid}`;

          // Navigate to SecretPreviewComponent with the generated link and expiration date
          this.router.navigate(['/secret-preview'], { state: { secretLink, expirationInDays: this.expirationInDays } });
        }, (error) => {
          console.error('Error creating secret:', error);  // Log the error to understand the issue
          alert('Error creating secret: ' + error.message);
        });
    } else {
      alert('Secret content is required.');
    }
  }    
}
