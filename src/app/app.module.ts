import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { GenerateSecretComponent } from './generate-secret/generate-secret.component';
import { SecretPreviewComponent } from './secret-preview/secret-preview.component';
import { RetrieveSecretComponent} from './retrieve-secret/retrieve-secret.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [RetrieveSecretComponent, AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    GenerateSecretComponent,
    SecretPreviewComponent,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
