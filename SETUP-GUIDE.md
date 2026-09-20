# FactFlow Check — setup and upgrade

## Upgrade existing classes

1. Open each existing class receiver in Google Apps Script.
2. Replace its code with the complete `factflow-apps-script.gs` from this version. This is the shared receiver for assessment and practice; do not add a second copy alongside the existing functions.
3. Verify the class-to-spreadsheet mapping in `CLASS_SPREADSHEET_IDS`. The receiver opens those explicit spreadsheet IDs, not whichever sheet happens to contain the script. The deploying Google account needs access to each target sheet it serves.
4. Use **Deploy → Manage deployments → Edit → New version → Deploy**, preserving the existing Web App URL. Run as yourself with access set to Anyone.
5. Publish the updated Check app after the receiver. The older Check client is supported through its `classCode` field; regular FactFlow practice submissions retain their existing response format.
6. Complete a supervised test and confirm **Results sent**, the class's Check row, and the matching Raw Data assessment ID. A new app against an old receiver keeps its result pending until the receiver is upgraded.

Existing rows and practice tabs are preserved. New metadata is appended to the right of the assessment sheets: Raw Data columns O–P hold the assessment ID and full JSON evidence; Check columns K–N hold the assessment ID, incomplete bands, unassessed bands, and stopping reason. Legacy Summary is renamed Check when appropriate. Existing legacy column labels may still say Developing; new assessments leave that field as None identified unless a band actually needs practice.

Do not test delivery by repeatedly submitting real student data. Use a clearly identified test student and verify the class destination before classroom use.

## Add a class

1. Create a Google Sheet and copy its spreadsheet ID from its URL.
2. Add the lower-case class key and spreadsheet ID to `CLASS_SPREADSHEET_IDS` in the receiver. Update `ALLOWED_CLASS_CODES` and the diagnostic list in `getAllowedSpreadsheetIds` too.
3. Deploy the receiver as a Web App using the V8 runtime, executing as the owner, with access set to Anyone.
4. Add an entry to `TEACHERS` in Check's `index.html`:

```js
'IP5/9': {
  name: 'Your class display name',
  spreadsheetId: 'YOUR_GOOGLE_SPREADSHEET_ID',
  url: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT/exec'
}
```

5. Share `https://ffc.mtomlinson.ca/?t=IP5/9`, replacing the class key as appropriate. An omitted route uses DEFAULT_TEACHER_KEY; an explicitly invalid or empty route is rejected.

The two apps can use the same receiver and spreadsheet while retaining separate assessment and practice tabs. No assessment is imported into practice, and no practice record is used as evidence in Check.

## Delivery recovery

Results save locally before sending. Failed or timed-out requests remain pending; Retry sending reuses the assessment ID. The receiver returns success only after writing and flushing the result, with the assessment ID and spreadsheet ID in its receipt. Repeated attempts repair incomplete summary writes without adding another raw record, and an older result cannot replace a newer summary.

Reloading reopens a pending result. Teacher Tools can reopen other saved results. Copy result is a manual fallback; it does not confirm delivery. Pending results prevent Clear All Results. Browser storage must remain available: clearing browser data can erase local unsent results.

Run `node test.cjs` before publishing. These local checks mock Google services; a deployment smoke test is still needed after the receiver upgrade.
