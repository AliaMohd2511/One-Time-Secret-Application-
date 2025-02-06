# One-Time-Secret-Application
<p>This angular application allows users to generate secrt links for sharing sensitive information securely. Secrets are stored in Redis and are accessible only once through a unique link. the application supports passphrase protection, expiration options, and the ability to burn secret before they are viewd. </p>

## Features
- **Generate Secret Link**: Users can generate a unigue link to share a secret message.
- **One-Time View**: Secrets can only be viewed once; after retrieval, the secret is deleted from the server.
- **Passphrase Protection**: Optionally, users can seta passphrase to protect the secret. Validation occurs at the backend, ensuring better scurity.
- **Expiration Options**: The secret link can be set to expire after a specified time (ee.g. 30 minutes, 1 hour, 7 days, 14 dayes).
- **Burn Secret**: Users can burn the secret, making it inaccessible, even before it is viewed.
- **Passphrase validation**: If a passphrase is required, the recipient must eneter it to view the secret. Backend vaildation is used to ensure only correct passphrase reveal the secret.
- **Copy to Clipboard**: Users can copy secret links and the secret itself directly to the clipboard without clicking on the link to prevent accidental navigation.
- 
