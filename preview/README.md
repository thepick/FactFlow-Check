# FactFlow Check 3.0 preview

An independent, supervised snapshot of multiplication accuracy and fluent recall. FactFlow practice remains separate. This release is a classroom pilot, not a validated diagnostic instrument or a permanent student level.

## What changed

- Named fact groups: 2s, 5s & 10s; 3s & 4s; 6s; 7s; 8s; 9s; 11s & 12s; Mixed facts: 2–12.
- Every group is assessed independently. Difficulty in one group does not block later groups.
- Four unscored 1-times-table examples teach the controls without priming scored facts.
- Eight initial questions per group; uncertain accuracy is revisited after all initial groups. Up to four extra unique facts per group, or three for a single table (there are only eleven unique facts from ×2 to ×12).
- Optional mixed recall: eighteen questions covering all eleven tables.
- Interrupted displays and repeated introductions are outside the scored budget; they are recorded separately where applicable.
- No repeated-fact retests or fast-track awards. Within a group, a reversed fact is the same fact.
- A computed maximum of 102 counted questions (98 scored), including every extra and mixed recall; 78 counted (74 scored) when initial evidence is clear. Without mixed recall the maximum is 84 counted.
- Between-section screens automatically continue after a visible ten-second countdown. Continue starts the next section immediately. No question is visible during the countdown; there is no end-check button on that screen.
- No total-time failure. The per-question deadline still applies. An interrupted question still requires teacher-authorised recovery; automatic section transitions never start questions while the page is hidden.

## Timing and evidence

Standard conditions allow ten seconds per question. A correct submitted response strictly under four seconds counts as fluent. Type or tap the answer; it submits automatically using the original entry behaviour. A full-length answer submits after 120 ms; a shorter nonmatching answer submits after a short pause (500–700 ms), while a matching partial answer waits for the remaining digits or the question deadline. Enter and Submit remain optional. Backspace and Clear cancel pending submission. Response time includes the submission delay.

Teacher-selected extended (20-second), untimed, or teacher-recorded oral responses assess accuracy only. They never earn standard fluency verdicts. Hiding the visual countdown does not extend the deadline. These settings apply to the next assessment on that device.

Provisional criteria, subject to the pilot:

| Sample | Accuracy | Fluent responses for standard fluency |
| --- | --- | --- |
| Initial 8 questions | At least 7 | At least 5 |
| Extended 11 questions | At least 10 | At least 7 |
| Extended 12 questions | At least 10 | At least 7 |
| Mixed 18 questions | At least 16 | At least 12 |

Correct but slower responses demonstrate accuracy, not fluency. Actual wrong answers can establish difficulty. A timeout or skip is separately recorded; if the missing responses could change the accuracy decision, the result remains incomplete. After at least six questions, a group can end early only when actual incorrect answers make the accuracy threshold mathematically unreachable even with all remaining questions correct. An interruption does not score an answer.

These are operational criteria, not population norms. Eight sampled questions do not certify every fact in a group. The report identifies sampled tables, conditions, missing evidence, dates, and the assessment ceiling.

## Pilot workflow

1. Open the preview using your class link. The standard classroom page remains version 2.8.0.
2. In Teacher Tools, choose response conditions, answer method, visual countdown, and whether to include mixed recall. Save & Exit. Settings are local to this browser/device.
3. Enter the student's name and teacher code. Complete or repeat the introduction, then continue through blank section screens.
4. Wait ten seconds between sections or select Continue to start sooner. Difficulty does not block later groups.
5. Download the JSON result and/or copy the readable summary. Preview results are saved locally only; no Google requests are made by the preview.
6. After a refresh, use Teacher: resume saved check. A visible interrupted fact is replaced with an unused fact; if none is available, evidence remains incomplete. A teacher must authorise resumption. Dates and interruptions are retained. Prefer the same supervised sitting; cross-day resumes are explicitly dated.
7. Clearing browser data removes local results and progress. Export results before doing so. A persistent warning appears if local storage fails.

Automatic class codes use a date/class-seeded mixed schedule and four digits, replacing the ordered word rotation. They change each four-hour Bangkok window and agree across devices in the same class. They are reproducible classroom codes, not secret random passwords. Custom codes remain device-local. The teacher passphrase is retained; they are classroom controls, not secure authentication. Do not use another student's name to resume a saved check. Complete it first.

## Results and compatibility

Reports separate accurate/fluent, accurate/fluency developing, accurate/standard fluency not assessed, difficulty observed, incomplete evidence, and not assessed. A strength in 9s can be shown even if 7s were difficult. All scores exclude the introduction; interruptions and pauses are separately recorded. Older local reports are displayed using their original verdicts and never rescored.

The receiver accepts legacy schema 2 and new schema 3. New results go into separate `Check v3` and hidden `Check Raw v3` tabs so old and new criteria do not overwrite each other. Conditions, version, dates, coverage, accuracy-only groups, and response gaps are retained. Practice tabs and practice logic are unchanged. The preview deliberately does not send results, even if an old receiver is installed.

## Validation

Run `node test.cjs`. No dependencies or real Google requests are needed. Tests cover strong, slow, uneven, wrong, timed-out, skipped, accommodated, maximum-budget, optional-mixed, interrupted and refreshed paths; 100 generated samples per group; storage failures; exact receipts; duplicate/stale retries; receiver validation; and legacy/practice separation.

A real Edge browser check additionally covers the full 78-question route, teacher settings, keyboard submission, a 74/74 scored result, mobile layout, zero preview POST requests, and refresh recovery.

See [PILOT.md](PILOT.md) for acceptance criteria and [SETUP-GUIDE.md](SETUP-GUIDE.md) for promotion. Real-student pilot observations remain to be collected before making this the default.
