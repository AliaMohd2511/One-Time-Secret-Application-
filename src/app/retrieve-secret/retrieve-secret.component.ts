import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecretService } from '../secret.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecretResponse } from '../secret-response.model'; 
import { Clipboard } from '@angular/cdk/clipboard';  

@Component({
  selector: 'app-retrieve-secret',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './retrieve-secret.component.html',
  styleUrls: ['./retrieve-secret.component.css']
})
export class RetrieveSecretComponent implements OnInit {
  secret: string | null = null;
  isAccessed: boolean = false;
  isPassphraseEntered: boolean = false;
  passphraseRequired: boolean = false;
  passphraseForm: FormGroup;
  copied: boolean = false; 

  constructor(
    private clipboard: Clipboard,
    private route: ActivatedRoute,
    private secretService: SecretService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.passphraseForm = this.fb.group({
      enteredPassphrase: ['', Validators.required]
    });
  }

  ngOnInit() {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.secretService.getSecret(uuid).subscribe(
        (response) => {
          this.secret = response.secret;
          this.passphraseRequired = response.passphraseRequired;
          this.isAccessed = false;
        },
        () => (this.isAccessed = true)
      );
    }
  }

  verifyPassphrase() {
    const enteredPassphrase = this.passphraseForm.get('enteredPassphrase')?.value;
    if (this.secret && enteredPassphrase === this.secret) {
      this.isPassphraseEntered = true;
    } else {
      alert('Incorrect passphrase!');
    }
  }
  onSubmit() {
    if (this.passphraseForm.valid) {
      const uuid = this.route.snapshot.paramMap.get('uuid');
      const { enteredPassphrase } = this.passphraseForm.value;

      if (uuid) {
        this.secretService.verifyPassphrase(uuid, enteredPassphrase).subscribe(
          (response: any) => {
            this.secret = response.secret; // Show the secret
            this.isPassphraseEntered = true; // Mark passphrase as entered
          },
          (error) => {
            console.error('Error:', error);
            alert('Incorrect passphrase. Please try again.');
          }
        );
      }
    }
  }

  goBack() {
    this.router.navigate(['/generate-secret']);
  }

  copyToClipboard() {
    if (this.secret) {
      this.clipboard.copy(this.secret);
      this.copied = true;

      setTimeout(() => {
        this.copied = false;
      }, 2000);
    }
  }
}