import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateSecretComponent } from './generate-secret/generate-secret.component';
import { SecretPreviewComponent } from './secret-preview/secret-preview.component';
import { RetrieveSecretComponent } from './retrieve-secret/retrieve-secret.component';


export const routes: Routes = [
  { path: 'generate-secret', component: GenerateSecretComponent },
  { path: 'secret-preview', component: SecretPreviewComponent }, 
  { path: 'secret/:uuid', component: SecretPreviewComponent },   
  { path: 'retrieve-secret/:uuid', component: RetrieveSecretComponent }, 
  { path: 'preview-secret/:uuid', component: SecretPreviewComponent },
  { path: '', redirectTo: '/generate-secret', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
