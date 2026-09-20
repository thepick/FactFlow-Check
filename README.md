# FactFlow Quiz 3.0

An independent, supervised snapshot of multiplication accuracy and fluent recall. FactFlow practice remains separate. This is a sampled classroom assessment, not a validated diagnostic instrument or a permanent student level.

## What changed

- Named fact groups: 2s, 5s & 10s; 3s & 4s; 6s; 7s; 8s; 9s; 11s & 12s; Final challenge: mixed facts 2Ã¢â‚¬â€œ12.
- Every group is assessed independently. Difficulty in one group does not block later groups.
- Four unscored 1-times-table examples teach the controls without priming scored facts.
- Eight initial questions per group; uncertain accuracy is clarified immediately with more questions from the same group before moving on. Up to four extra unique facts per group, or three for a single table (there are only eleven unique facts from Ãƒâ€”2 to Ãƒâ€”12).
- Required final challenge: eighteen mixed-recall questions covering all eleven tables, after all other groups and their immediate follow-up questions. It appears in the same report and overall response totals as the other groups.
- Interrupted displays and repeated introductions are outside the scored budget; they are recorded separately where applicable.
- No repeated-fact retests or fast-track awards. Within a group, a reversed fact is the same fact.
- A computed maximum of 102 counted questions (98 scored), including every extra and mixed recall; 78 counted (74 scored) when initial evidence is clear.
- Between-section screens automatically continue after a visible ten-second countdown. Continue starts the next section immediately. No question is visible during the countdown; there is no end-check button on that screen.
- No total-time failure. The per-question deadline still applies. An interrupted question still requires teacher-authorised recovery; automatic section transitions never start questions while the page is hidden.

## Timing and evidence

Standard conditions allow ten seconds per question. A correct submitted response strictly under four seconds counts as fluent. Type or tap the answer; it submits automatically using the original entry behaviour. A full-length answer submits after 120 ms; a shorter nonmatching answer submits after a short pause (500Ã¢â‚¬â€œ700 ms), while a matching partial answer waits for the remaining digits or the question deadline. Enter and Submit remain optional. Backspace and Clear cancel pending submission. Response time includes the submission delay.

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

## Classroom workflow

1. Open FactFlow Quiz using your existing class link.
2. In Teacher Tools, choose response conditions, answer method and visual countdown. Save & Exit. Settings are local to this browser/device.
3. Enter the student's name and teacher code. Complete or repeat the introduction, then continue through blank section screens.
4. Wait ten seconds between sections or select Continue to start sooner. Difficulty does not block later groups.
5. Download the JSON result and/or copy the readable summary. Live results are sent automatically to your class spreadsheet. Check for confirmation; use Retry sending if delivery fails.
6. After a refresh, use Teacher: resume saved check. A visible interrupted fact is replaced with an unused fact; if none is available, evidence remains incomplete. A teacher must authorise resumption. Dates and interruptions are retained. Prefer the same supervised sitting; cross-day resumes are explicitly dated.
7. Clearing browser data removes local results and progress. Export results before doing so. A persistent warning appears if local storage fails.

Automatic class codes use a date/class-seeded mixed schedule and four digits, replacing the ordered word rotation. They change each four-hour Bangkok window and agree across devices in the same class. They are reproducible classroom codes, not secret random passwords. Custom codes remain device-local. The teacher passphrase is retained; they are classroom controls, not secure authentication. Do not use another student's name to resume a saved check. Complete it first.

## Results and compatibility

Reports separate accurate/fluent, accurate/fluency developing, accurate/standard fluency not assessed, difficulty observed, incomplete evidence, and not assessed. A strength in 9s can be shown even if 7s were difficult. All scores exclude the introduction; interruptions and pauses are separately recorded. Older local reports are displayed using their original verdicts and never rescored.

The receiver accepts legacy schema 2 and new schema 3. New results go into separate `FactFlow Quiz` and hidden `FactFlow Quiz Raw` tabs so old and new criteria do not overwrite each other. Conditions, version, dates, coverage, accuracy-only groups, and response gaps are retained. Practice tabs and practice logic are unchanged. The separate /preview/ page remains local-only. Preview results are never automatically submitted by the live app; live attempt locks and saved sessions are separate.

## Validation

Run `node test.cjs`. No dependencies or real Google requests are needed. Tests cover strong, slow, uneven, wrong, timed-out, skipped, accommodated, maximum-budget, mandatory final-challenge, interrupted and refreshed paths; 100 generated samples per group; storage failures; exact receipts; duplicate/stale retries; receiver validation; and legacy/practice separation.

A real Edge browser check additionally covers the full 78-question route, teacher settings, keyboard submission, a 74/74 scored result, mobile layout, zero preview POST requests, and refresh recovery.

See [PILOT.md](PILOT.md) for acceptance criteria and [SETUP-GUIDE.md](SETUP-GUIDE.md) for promotion. Michael approved promotion after the classroom preview and interface revisions. Continue collecting classroom observations to review the provisional criteria.

## Teacher-only percentage grade

FactFlow Quiz columns W-Z contain Teacher Grade %, Grade Basis, Level-weighted Accuracy %, and Level-weighted Fluency %. The receiver calculates these values; they are never returned to the browser or added to student reports or downloads.

Each of the eight levels contributes 12.5%, including the final challenge. Average correct/questions across levels and average fluent/questions across levels, then combine 60% accuracy + 40% fluency. All scored responses within each level count, including clarification questions. Wrong, timed-out and skipped responses earn zero; introductions are excluded. Extra questions do not increase a level's weight. This is a classroom scoring convention, not a standardized grade.

Only completed routes receive a grade. A level ended early for clear difficulty still counts; unfinished assessments remain ungraded. Extended, untimed and teacher-recorded checks show accuracy only, with combined grade and standard fluency blank. Numeric fractions display rounded to the nearest whole percent. James's supplied example displays as 58% (58.434...% before rounding) with equal level weights, versus the earlier provisional 61% pooled estimate.

After updating both receivers, run refreshTeacherGrades in the Apps Script editor to fill existing IP5/8 and IP5/9 summary grade columns from saved schema-3 evidence matched by assessment ID. It updates only these four columns and their formatting. Raw evidence, legacy results and student verdicts remain unchanged. New submissions and retries calculate the grade automatically. The helper is not exposed as a public receiver action. Existing spreadsheet sharing controls access to grades.

The public name is FactFlow Quiz. Existing URLs, repository names, storage keys and receiver identifiers are retained for compatibility, so saved results, active sessions and class links continue to work. New downloads use the FactFlow-Quiz filename prefix.

Current receiver deployments use FactFlow Quiz and hidden FactFlow Quiz Raw tabs, renaming earlier schema-3 tabs in place. Legacy schema-2 clients still use Check / Raw Data separately.
