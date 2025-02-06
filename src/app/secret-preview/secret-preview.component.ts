import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SecretService } from '../secret.service';
import { Clipboard } from '@angular/cdk/clipboard';  
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-secret-preview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './secret-preview.component.html',
  styleUrls: ['./secret-preview.component.css']
})
export class SecretPreviewComponent implements OnInit {
  secretLink: string | null = null;
  secret: string | null = null;
  expirationInDays: string | null = null;
  uuid: string | null = null;
  copied: boolean = false; 
  passphrase: string | null = null; 

  constructor(
    private secretService: SecretService,
    private router: Router,
    private route: ActivatedRoute,
    private clipboard: Clipboard  
  ) {}

  ngOnInit() {
    // Retrieve the secret link and expiration information from navigation state
    this.secretLink = history.state.secretLink;
    this.expirationInDays = history.state.expirationInDays;

    // Subscribe to route parameters to get the UUID
    this.route.params.subscribe(params => {
      this.uuid = params['uuid'];
      this.getSecret(); // Fetch the secret details based on the UUID
    });
  }

  getSecret() {
    if (this.uuid) {
      this.secretService.getSecret(this.uuid).subscribe(
        (response) => {
          this.secret = response.secret; // Store the retrieved secret
        },
        (error) => {
          console.error('Error retrieving secret:', error);
          alert('Error retrieving secret: ' + error.message);
        }
      );
    }
  }

burnSecret() {
  if (!this.secretLink) return alert('No secret link to burn.');

  const uuid = this.extractUuidFromLink(this.secretLink);
  if (!uuid) return alert('Invalid secret link: UUID could not be extracted.');

  // Include passphrase when calling burnSecret
  this.secretService.burnSecret(uuid, this.passphrase).subscribe(
    () => {
      alert('Secret burned successfully!');
      this.router.navigate(['/generate-secret']);
    },
    (error) => {
      console.error('Error burning secret:', error);
      alert('Error burning secret: ' + error.message);
    }
  );
}

  createNewSecret() {
    this.router.navigate(['/generate-secret']);
  }

  private extractUuidFromLink(link: string | null): string | null {
    return typeof link === 'string' ? link.split('/').pop() || null : null;
  }

  copyToClipboard() {
    if (this.secretLink) {
      this.clipboard.copy(this.secretLink); // Copy the secret link to the clipboard
      this.copied = true; // Indicate that the link has been copied

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    }
  }
}