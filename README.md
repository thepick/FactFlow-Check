# FactFlow Check v2

FactFlow Check is a separate supervised assessment app for multiplication fact placement. It is meant to identify the hardest fact band a student can answer accurately and reasonably quickly without using regular FactFlow practice progress.

## What changed in v2

- Tracks and clears the short auto-submit timer so cleared answers cannot submit later as wrong.
- Checks time/question limits before moving into a new band, avoiding phantom attempted bands.
- Rebalances single-factor bands such as 6s, 7s, 8s, and 9s so the intended easy/core/hard mix is possible.
- Adds both Clear and Backspace controls on the on-screen keypad.
- Uses a slightly longer idle-submit window for 3-digit answers.
- Adds a UTF-8 marker to CSV exports so names open correctly in Excel.
- Saves starting band, highest attempted band, restart count, and full question-level data.
- Uses a storage event listener so teacher setup and results refresh across tabs when no assessment is active.
- Keeps history visible without silently clipping older results.

## Deployment

Upload `index.html` to the root of a GitHub Pages repository, or upload the entire zip contents to a web host.

## Classroom workflow

1. Open the app.
2. Teacher gives the class code shown in Teacher Tools, or uses the daily fallback code.
3. Student enters name/ID and the code.
4. Student completes the adaptive check.
5. Student shows the teacher the result screen.
6. Teacher can copy the summary or export CSV from Teacher Tools.

## Notes

The one-time-per-code lock is local to the device because this version has no backend. A new code or new assessment name allows another assessment later in the year.
