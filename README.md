# FactFlow Check v1.2

FactFlow Check is a separate supervised placement check for multiplication facts. It does not use regular FactFlow practice progress.

## Version 1.2 changes

- Restored a student-first interface with teacher setup hidden behind the Teacher button.
- Kept the original FactFlow Check style and result-screen layout.
- Shows the full result immediately when the check finishes.
- Removed CSV export from the interface.
- Added fluency-aware fast-track logic so very fluent students can climb faster.
- Fixed the 45-question ceiling so strong students can reach the mixed 2-12 band.
- Prevents the app from starting a band it cannot finish within the question limit.

## How to use

1. Open `index.html`.
2. Click Teacher.
3. Set the assessment name, assessment ID, class name, and teacher code.
4. Click Save Setup.
5. Click Begin Student Check.
6. Students enter their name, ID, and teacher code.
7. The result appears on screen when the check is complete.

## One-time use note

The one-time attempt lock works on the same device and browser. Clearing browser data or using another device can bypass it. A future Google Sheets version would be needed to enforce this across devices.
