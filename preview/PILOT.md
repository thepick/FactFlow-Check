# Classroom pilot and release checklist

## Representative students

Try the preview with students showing emerging recall, uneven strengths, fluent recall, accurate but slower answers, and students using their usual teacher-selected accommodations. Do not manufacture difficulties or change an accommodation to fit a test case. The assessment covers multiplication facts from 2–12; use teacher assessment outside that scope.

For each supervised check, record:

| Observation | Record |
| --- | --- |
| Date and assessment ID | From downloaded result |
| Conditions and input method | Standard / extended / untimed; student / teacher |
| Controls understood | Whether introduction was repeated or help was needed |
| Time and fatigue | Ten-second transitions, fatigue, recovery interruptions |
| Coverage | Groups resolved, incomplete, not assessed; final challenge completed? |
| Teacher agreement | Which reported strengths/difficulties match classroom evidence? |
| Timing concern | Finger counting, typing delay, mistaken submission, distracting countdown |
| Recovery | Any interruption, refresh, lost progress, or storage warning |
| Action | Keep criteria, investigate an item, adjust interface, or review thresholds |

## Release gates

- A warm-up mistake must not block any scored group.
- Mixed recall is the required final stage and appears alongside every other group in the report; old settings cannot disable it.
- A weak group must not block stronger groups later in the assessment.
- No optional questions may exhaust the allowance needed for selected later groups.
- Slow correct answers must not be reported as standard fluent recall.
- Accommodated or teacher-recorded checks must not claim standard fluency.
- Missing responses must not be confused with actual incorrect responses.
- Ten-second section countdowns advance once; Continue starts sooner, and hidden pages do not start unseen timed questions.
- Every constituent table is represented in a completed initial sample.
- Reports and exports identify conditions, dates, coverage and assessment version.
- Existing historical results and practice data remain unchanged.
- Classroom observations support the provisional timing/scoring criteria; revise and rerun tests if they do not.

## Promotion sequence

1. Review pilot observations with Michael. Software tests are complete; the human pilot is not.
2. Apply any agreed changes and run the regression and browser checks.
3. Deploy the schema-3-compatible receiver to both existing class endpoints. Keep URLs, owners and access settings unchanged. Verify receipts and class routing.
4. Confirm new records use Check v3 / Check Raw v3, while legacy and practice records still use their own tabs.
5. Set PREVIEW_MODE to false, give the release a non-preview version, and update preview-only notices.
6. Publish the approved classroom app. Retain the previous release in Git for rollback.

No automated rescore, placement handoff, practice import, or practice mastery update is part of this release.
