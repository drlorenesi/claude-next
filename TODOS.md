# App TODOs

## General

- Check if DB is offline
- Add rate limiting
- Security checkup
- Add "Keep me signed in." (in spanish) checkbox in the login form at `/login`.
- Add button to show password to user in login screen
- Check if unauthorized user can access a route, otherwise show "No Autorizado".
- Auto logout after a certain amount of time

## App Features

- Add user update route/form
- Add change password route/form
- Add date form in spanish
- Work on `proxy.ts` to re-route user depending on session status
- Integrate e-mail service to send verification link and password reset

## Database

- Update `db.ts` connection module to be similar to `mysql.ts`
- Check database structure

## Scripts

- Check createDB script
- Add test script for `db.ts`/`mysql.ts` connetion module
