# Telecom Dashboard (LBP) — HTML + JS + Tailwind + Firebase

Dark-themed telecom dashboard inspired by Alfa U-Share (Lebanon) with:
- **Login/Signup** (Firebase Auth, Email/Password)
- **Profile** (read/update first/last name; phone locked)
- **Open/Closed Services** (packages, purchase modal)
- **Add Credit** (upload proof to Storage; request to Firestore)
- **Credit History & Order History** (filters, tables)
- **Persistent sidebar** (collapsible; icons-only when collapsed)
- **Dark mode** (localStorage)

All UI is in `index.html`. Logic is in `app.js`.

## 1) Quick Start

- Serve the folder with a local server (recommended: VS Code Live Server extension or Python HTTP server). Opening via `file://` can break some Firebase flows.
- Open `index.html` in the browser.

## 2) Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. In Project settings > General > Your apps > Web app, copy the config object.
3. In `app.js`, replace the `firebaseConfig` placeholder with your values:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
```

4. Enable Email/Password auth:
   - Console > Build > Authentication > Sign-in method > Email/Password: Enable.

5. Create Firestore (in Native mode):
   - Console > Build > Firestore Database > Create database

6. Create Storage bucket:
   - Console > Build > Storage > Get started

### Suggested Security Rules (start simple for local testing)

Firestore (allow authenticated read/write; tighten for production):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Storage (allow authenticated uploads; tighten for production):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 3) Data Model

Collections used by the app:

- `users/{uid}`
  - `firstName`: string
  - `lastName`: string
  - `phone`: string (8 digits, Lebanese; non-editable in UI)
  - `email`: string
  - `balanceLBP`: number (default 0)
  - `createdAt`: timestamp
  - `updatedAt`: timestamp (optional)

- `orders/{autoId}`
  - `uid`: string (owner)
  - `packageSizeGB`: number
  - `priceLBP`: number
  - `secondaryPhone`: string (8 digits)
  - `status`: string (e.g., pending/completed/failed)
  - `createdAt`: timestamp

- `creditRequests/{autoId}`
  - `uid`: string (owner)
  - `amountLBP`: number
  - `paymentMethod`: string (e.g., "transfer")
  - `proofUrl`: string|null
  - `status`: string (pending/approved/rejected)
  - `requestDate`: timestamp
  - `processedDate`: timestamp (optional)
  - `processedBy`: string (optional)
  - `rejectionReason`: string (optional)

Storage paths:
- `creditProofs/{uid}/{filename}`

## 4) Lebanese Phone Rules

- Inputs accept exactly 8 digits (e.g., `70xxxxxx`).
- Do not include `+961` or leading `0`.

## 5) Features Mapping

- **Profile**: shows profile from `users/{uid}`; phone locked; Save enables when name fields change.
- **Open Services**: static empty state.
- **Closed Services**: predefined packages; purchase modal validates phone and writes to `orders`.
- **Add Credit**: amount (0–999,999.99 LBP), optional proof upload to Storage, request saved to `creditRequests`.
- **Credit History**: filters by status and date range (client-side check), shows table or empty state.
- **Order History**: filters by status/date, plus search by phone (client-side), shows table or empty state.
- **Sidebar**: collapsible; icons remain visible when collapsed.
- **Top bar**: username, balance (LBP), dark-mode toggle, optional help button on certain pages.

## 6) Notes on Firestore Queries & Indexes

- Queries use `where('uid', '==', uid)` then `orderBy('createdAt' | 'requestDate')`. Equality with orderBy typically works without a composite index; if Firestore requests an index, follow the console link to create it.
- Some filters (date range, text search) are applied client-side after fetching the user’s documents.

## 7) Running Locally

- Option A (VS Code): Install “Live Server” extension, right-click `index.html` > Open with Live Server.
- Option B (Python):
  - Python 3: `python -m http.server 5500`
  - Then open http://localhost:5500/index.html

## 8) Customizing Packages

- Edit the `PACKAGES` array in `app.js` to change sizes/prices.

```js
const PACKAGES = [
  { sizeGB: 5.5, priceLBP: 350000 },
  { sizeGB: 10,  priceLBP: 600000 },
  // ...
];
```

## 9) Production Hardening Checklist

- Tighten Firestore & Storage security rules (restrict by `request.auth.uid`).
- Server-side validation for credit requests and orders (Cloud Functions) if needed.
- Add phone normalization and extra validation (e.g., allowed prefixes 70/71/76/etc.).
- Add status transitions and admin moderation UIs.
- Persist balance changes when orders are completed (Cloud Functions/back office).
- Add toast notifications and error boundary UI.

## 10) Troubleshooting

- Blank screen or auth not working: check browser console for Firebase errors; verify config in `app.js`.
- Storage uploads fail: confirm Storage rules allow authenticated users and file size/type.
- Firestore index error: use the link from the console error to create a composite index.
- Phone validation failing: must be exactly 8 digits with no `+961` or leading `0`.
