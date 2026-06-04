# FactFlow Check - Smart Placement

FactFlow Check is a separate assessment app for supervised multiplication fact checks. It is designed to look and feel familiar to FactFlow users, but it does not read or write regular FactFlow practice progress.

## Version 1 features

- Separate assessment app
- Teacher setup with assessment name, assessment ID, class name, and teacher code
- Teacher code generator
- Student name and student ID entry
- Local one-time attempt lock using class, assessment ID, student ID, and teacher code
- Restart detection for interrupted attempts
- Warm-up calibration
- Adaptive fact-band placement check
- Per-question timer
- Balanced question selection inside each band
- Missed fact and timeout tracking
- Verified level and developing level result
- Recommended next practice focus
- Local result history

## Important note about one-time use

Version 1 uses local browser storage. This prevents a completed student from reusing the same assessment code on the same device and browser. It is useful for normal supervised classroom use, but it is not a secure cross-device lock.

For stronger control later, add Google Sheet or backend submission so the app can check completed attempts across devices.

## Suggested classroom workflow

1. Open the app on student devices.
2. Set the assessment name, assessment ID, class name, and teacher code.
3. Write the teacher code on the board.
4. Students enter their name, student ID, and code.
5. Students complete the check.
6. Students show the teacher the completion screen.
7. The teacher opens the result screen and records or exports the result.

## Assessment bands

- Band A: 2s, 5s, 10s
- Band B: 3s, 4s
- Band C: 6s
- Band D: 7s
- Band E: 8s
- Band F: 9s
- Band G: 11s, 12s
- Band H: Mixed 2-12

## Result categories

- Fluent: correct under 4 seconds
- Known but slow: correct in 4 to 8 seconds
- Not fluent: correct after 8 seconds
- Not secure: wrong or timeout

## Files

- `index.html`: complete app
- `assets/`: icon files copied from FactFlow
