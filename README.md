# FactFlow Check

FactFlow Check is an independent, supervised assessment of multiplication fact accuracy and fluency. It gives teachers a snapshot of the student's skills at the time of testing. FactFlow is a separate practice app: Check neither reads practice progress nor changes it.

## Version 2.8.0

- Retest successes cannot replace incorrect first responses when deciding whether a band is demonstrated.
- Results distinguish Demonstrated, Needs practice, Incomplete evidence, and Not assessed.
- Failed submissions remain saved on the device across reloads. Retry sending uses the same assessment ID.
- The shared Google Sheets receiver acknowledges the exact assessment and destination spreadsheet, prevents duplicate retry rows, and keeps older retries from replacing newer snapshots.
- Unknown class links stop with an error instead of silently using another class.

## Assessment

The assessment starts with six warm-up questions. A strong warm-up verifies Band A and starts the fast-track path: six-question gateways for B–G, with four extra questions when needed. Otherwise, each standard band starts with eight questions and may add four. Band H uses 18 mixed questions.

| Band | Facts |
| --- | --- |
| A | 2s, 5s, 10s |
| B | 3s, 4s |
| C | 6s |
| D | 7s |
| E | 8s |
| F | 9s |
| G | 11s, 12s |
| H | Mixed 2–12 |

Each question allows ten seconds. Correct responses under four seconds are fluent; four to eight seconds are known but slow; later correct responses are not fluent. Wrong answers and timeouts are recorded separately.

First responses and extra questions determine accuracy and fluency thresholds. Retests can confirm repeated difficulty, but successful retests do not increase the scoring sample. Displayed totals include retests. Retests cannot consume the question budget reserved for the rest of the current block.

The check stops at 60 questions, or at the time limit (400 seconds, after at least 12 responses), or when it has enough evidence to stop the climb. The existing band order and thresholds are retained. The standard path can exhaust its budget before higher bands; those bands are explicitly **Not assessed**, never assumed weak.

## Reading the snapshot

- **Demonstrated:** the sampled band met the accuracy and fluency criteria.
- **Needs practice:** sufficient evidence was collected and the criteria were not met.
- **Incomplete evidence:** the band was started but could not be resolved before a limit.
- **Not assessed:** no band questions were administered.

The result lists every band, the highest contiguous demonstrated band, observed difficulty, missed facts, and the reason the assessment ended. No difficulty identified in the assessed bands does not imply that all facts have been mastered. This sampled snapshot supports teacher judgment; it is not a permanent mastery label.

## Classroom workflow

1. Share the correct class link, such as `https://ffc.mtomlinson.ca/?t=IP5/9`.
2. Students enter their name and the teacher's code, then complete the supervised check.
3. Results send automatically. **Results sent** appears only after an exact receiver acknowledgment.
4. If sending fails, use **Retry sending** or **Copy result**. Pending results stay saved after Done or reload; Teacher Tools also lets you reopen saved results. Copying does not mark a result as sent.
5. The teacher's **Check** sheet shows the latest snapshot per normalized student name. Hidden **Raw Data** retains each distinct assessment and its complete JSON evidence. Practice remains in separate **FactFlow Practice** and **Practice Raw Data** tabs.

Use distinct names for students with the same name: the summary still matches normalized names. The local attempt barrier still allows one attempt per code/assessment/device; shared devices need a fresh code or a teacher-cleared lock. Custom codes are device-local. These classroom barriers are not secure authentication.

Teacher Tools uses the existing passphrase (default `strawberry`). Clearing results is blocked while any result is pending. Older locally saved results remain viewable, with delivery status marked unknown; their original verdicts are not retroactively rescored.

## Setup and checks

See [SETUP-GUIDE.md](SETUP-GUIDE.md). **Deploy the updated shared receiver before publishing this app.** The receiver shipped here and in FactFlow is the same code; use either copy, not both in one Apps Script project.

Run `node test.cjs` for the dependency-free regression check. It tests both adaptive paths, scoring, interrupted coverage, routing, offline recovery, receipts, safe retries, and separation from practice reporting without contacting Google.
