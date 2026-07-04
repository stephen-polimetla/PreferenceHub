# PreferenceHub

A modern, responsive single-page web application to collect user preferences and practice full-stack development.

## Features

- React + Vite + TypeScript
- Tailwind CSS styling
- Firebase Firestore storage
- Multilingual support (English and Telugu)
- React Hook Form validation
- Framer Motion animations
- Admin dashboard with password protection, search, filter, delete, and CSV export
- Autosave progress in the browser
- Dark mode support
- Responsive premium UI with cards, progress indicator, and review screen

## Setup

1. Clone the repository.
2. Copy `.env.example` to `.env`.
3. Fill in your Firebase configuration values and set `VITE_ADMIN_PASSWORD`.

```bash
npm install
npm run dev
```

Open the URL shown in the terminal, or visit `http://localhost:4173`.

## Environment Variables

Create a `.env` file with the following values:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_ADMIN_PASSWORD=preferencehub-admin
```

## Firebase Firestore Setup

1. Create a Firebase project.
2. Enable Firestore in test mode or configure appropriate security rules.
3. Use the Firebase project credentials in `.env`.
4. The application writes submissions to the `submissions` collection.

### Recommended Firestore schema

- Collection: `submissions`
  - Document fields:
    - `createdAt` (timestamp)
    - `language` (string)
    - `browser` (string)
    - `deviceType` (string)
    - `answers` (map)
      - `firstName` (string)
      - `ageGroup` (string)
      - `gender` (string)
      - `favoriteColor` (string)
      - `favoriteFlower` (string)
      - `favoriteFruit` (string)
      - `favoriteAnimal` (string)
      - `sunriseOrSunset` (string)
      - `petsPreference` (string)

## Deployment

### Firebase Hosting

1. Install Firebase CLI if needed:

```bash
npm install -g firebase-tools
```

2. Login and initialize hosting:

```bash
firebase login
firebase init hosting
```

- Select your Firebase project
- Set the public directory to `dist`
- Configure as a single-page app? `Yes`
- Overwrite `index.html`? `No`

3. Build and deploy:

```bash
npm run build
firebase deploy --only hosting
```

4. Your app will be available at the Firebase Hosting URL shown after deployment.

### Vercel

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Sign in to [Vercel](https://vercel.com/) and create a new project.
3. Select this repository.
4. Under project settings, set the environment variables from `.env`:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_ADMIN_PASSWORD`

5. Use these settings:

- Build command: `npm run build`
- Output directory: `dist`

6. Deploy and use the public Vercel URL.

### Netlify

1. Push your code to GitHub, GitLab, or Bitbucket.
2. Sign in to [Netlify](https://app.netlify.com/).
3. Create a new site from Git.
4. Set the build command to `npm run build` and publish directory to `dist`.
5. Add the environment variables above in Netlify site settings.
6. Deploy and use the generated Netlify URL.

## Testing

Run the unit test suite with:

```bash
npm test
```

## Notes

- The admin dashboard is available at `/admin`.
- Use the hidden password from `VITE_ADMIN_PASSWORD` to unlock it.
- The app persists language and form progress in local storage.
- Do not enter sensitive or confidential information into the form.

## Viewing Responses

Responses are stored in your Firebase Firestore project under the `submissions` collection.

- Open the Firebase console
- Select your project
- Navigate to Firestore Database
- Open the `submissions` collection

You can also view answers inside the app by visiting `/admin` and entering the admin password set in `VITE_ADMIN_PASSWORD`.
