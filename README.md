# FactFlow Check v2.5

FactFlow Check is a separate supervised assessment app for multiplication fact placement. It looks and feels similar to FactFlow, but it does not use regular FactFlow practice progress as proof of mastery.

## What changed in v2.5

- Full results now appear automatically when the check finishes.
- Students do not need a teacher password to see the result screen.
- The separate completion screen is no longer part of the normal flow.
- CSV export is not included.
- Results are meant to be read and recorded directly from the screen.
- Fast, accurate answers now help strong students climb more efficiently.
- A strong student can now complete the full fast-track path within the 60-question cap.
- The app checks whether there is enough question budget before starting the next full band.
- The 10-second question limit remains, but fluency is judged by response speed.

## Response categories

Each answer is classified using accuracy and response time.

- Correct under 4 seconds: fluent
- Correct in 4 to 8 seconds: known but slow
- Correct after 8 seconds: not fluent
- Wrong answer: not secure
- Timeout: not secure

Accuracy still matters most, but fast correct answers provide stronger evidence of mastery.

## Fast-track logic

The warm-up has 6 questions. If the student answers the warm-up correctly and fluently, the app treats Band A as verified from warm-up evidence and moves the student into a fast-track path.

In fast-track mode:

- Bands B through G start with 6-question gateway blocks.
- A perfect or near-perfect fluent gateway block moves the student up.
- An unclear gateway block triggers 4 more questions from the same band.
- A weak gateway block stops the climb.
- Band H uses an 18-question mixed 2-12 check.

This allows a very strong student to complete:

- Warm-up: 6 questions
- Bands B-G: 6 bands x 6 questions = 36 questions
- Band H: 18 questions
- Total: 60 questions

## Standard path

Students who do not qualify for the fast-track path use the regular adaptive path.

- 8 questions per band
- 4 extra questions if the result is unclear
- Early finish when the app has enough evidence
- Stop before starting a band that cannot be completed within the question cap

## Fact bands

- Band A: 2s, 5s, 10s
- Band B: 3s, 4s
- Band C: 6s
- Band D: 7s
- Band E: 8s
- Band F: 9s
- Band G: 11s, 12s
- Band H: Mixed 2-12

## One-code-per-student lock

The app still uses a local attempt lock. A student cannot casually complete the same check again with the same name and code on the same device/browser.

This is a classroom barrier, not a secure online login. A different browser, cleared storage, or another device can bypass it.

## Teacher tools

The teacher area is still hidden behind the passphrase. It can be used to:

- Set the assessment name
- Set an optional class code
- Generate a class code
- Review saved results on the device
- Clear saved results and local attempt locks

The result after a student finishes does not require the teacher passphrase.

## Suggested classroom workflow

1. Teacher opens Teacher Tools and confirms the assessment name and code.
2. Students enter their name or ID and the teacher code.
3. Students complete the check independently.
4. The result screen appears automatically.
5. Teacher records the visible result from the screen.
6. Student starts normal practice or waits for instructions.

## Files

- index.html: the complete FactFlow Check app
- README.md: this file
