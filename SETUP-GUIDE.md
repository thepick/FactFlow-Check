# FactFlow Quiz 3.0 setup

Version 3.0 sends completed assessments to the existing class Google Sheets and retains local copies. The separate /preview/ page remains local-only. Live progress and attempt locks use separate storage keys, so pilot sessions cannot block a live check.

## Run locally

Serve this directory with a local HTTP server, then open index.html with your class parameter, for example ?t=IP5/9. Keep assessment.js beside index.html. Teacher access requires a secure browser context (HTTPS or localhost).

## Existing class routing

The TEACHERS map in index.html specifies class code, spreadsheet ID and Apps Script endpoint. Missing class parameters use the documented IP5/9 default; invalid explicit parameters fail closed. Keep existing school links and routing IDs.

## Receiver compatibility for version 3.0

The updated factflow-apps-script.gs and FactFlow's factflow-practice-apps-script.gs are identical. Install either complete file in each existing Apps Script project, save, then update the existing deployment to a new version. Keep its endpoint and access settings unchanged. This step is not necessary to use the local-only preview.

The new receiver supports schema 2 and schema 3. Schema 3 records are separated into FactFlow Quiz and FactFlow Quiz Raw; existing Check, Raw Data, FactFlow Practice and Practice Raw Data remain intact. Literal-cell handling, strict spreadsheet routing, assessment IDs, deduplication, stale-result protection and exact acknowledgments are retained. Complete JSON evidence is stored in the hidden raw tab.

Preview-only results are not queued for automatic later submission. Export them during the pilot. Promoting the app does not retroactively change or rescore those results.

Run node test.cjs before deployment. Use PILOT.md to review classroom observations and future releases. The existing teacher passphrase remains unchanged; classroom codes and passphrase protection are not strong authentication.

## Verified rollout — 21 September 2026

- Live and preview interfaces are named FactFlow Quiz. The preview does not submit results.
- Both class receivers calculate teacher-only whole-percentage grades with equal level weights and a 60% accuracy / 40% fluency split.
- IP5/9 runs the renamed-tab receiver. Its current report is FactFlow Quiz; its obsolete Check and Raw Data tabs were removed at the teacher's request. FactFlow practice tabs were preserved. FactFlow Quiz Raw is created when the first live quiz result arrives.
- IP5/8 retains Check v3 / Check Raw v3 tab names until its receiver is upgraded.
- GitHub Pages deploys the static app. Apps Script receiver code must be deployed separately; pushing this repository does not update Google deployments.
