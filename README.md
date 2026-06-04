# FactFlow Check v2.2

FactFlow Check is a separate supervised assessment app for multiplication fact placement. It is meant to identify the hardest fact band a student can answer accurately and reasonably quickly without using regular FactFlow practice progress.

## What changed in v2.2

- Adds a teacher access lock before opening Teacher Tools.
- Locks the teacher result screen behind the same teacher access check.
- Uses a salted SHA-256 hash check instead of storing the teacher passphrase as plain text.
- Keeps the student page simple: name/ID, teacher code, and Begin Check.
- Stops showing the class code on the student page. Students must get the code from the teacher.
- Accepts only the saved class code or today's fallback code; random code-looking entries are no longer accepted.
- Removes CSV and JSON export controls from Teacher Tools.
- Removes the dark theme and theme toggle.
- Adds a Lock Teacher Area button and a 15-minute teacher auto-lock.

## What changed in v2.1

- Fixes a runaway retest loop where repeated wrong answers could keep generating reversal retests until the 45-question maximum.
- Caps reversal retests to four per band and only one retest per fact family per band.
- Prevents retest questions from creating more retest questions.
- Adds an early-stop rule for clearly struggling performance inside a band after enough evidence is gathered.

## What changed in v2

- Tracks and clears the short auto-submit timer so cleared answers cannot submit later as wrong.
- Checks time/question limits before moving into a new band, avoiding phantom attempted bands.
- Rebalances single-factor bands such as 6s, 7s, 8s, and 9s so the intended easy/core/hard mix is possible.
- Adds both Clear and Backspace controls on the on-screen keypad.
- Uses a slightly longer idle-submit window for 3-digit answers.
- Saves starting band, highest attempted band, restart count, and full question-level data.
- Uses a storage event listener so teacher setup and results refresh across tabs when no assessment is active.
- Keeps history visible without silently clipping older results.

## Deployment

Upload `index.html` to the root of a GitHub Pages repository, or upload the entire zip contents to a web host.

## Classroom workflow

1. Open the app.
2. Teacher opens Teacher Tools, enters the teacher passphrase, and sets or checks the class code.
3. Teacher gives students the class code.
4. Student enters name/ID and the code.
5. Student completes the adaptive check.
6. Student shows the teacher the completion screen.
7. Teacher taps Teacher Result and enters the passphrase if needed.
8. Teacher reviews the result and can start a new check.

## Notes

This teacher lock is a classroom barrier, not true backend security. Because this is a static web app, a determined person with developer tools could inspect or bypass client-side code. For Grade 5 classroom use, it keeps the teacher tools out of normal student view.

The one-time-per-code lock is local to the device because this version has no backend. A new code or new assessment name allows another assessment later in the year.
