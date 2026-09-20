# FactFlow Check 3.0 setup

The current branch is a preview. It saves locally and provides Copy result and Download result; it does not submit to Google Sheets. The existing production app and receivers continue to operate separately.

## Run locally

Serve this directory with a local HTTP server, then open index.html with your class parameter, for example ?t=IP5/9. Keep assessment.js beside index.html. Teacher access requires a secure browser context (HTTPS or localhost).

## Existing class routing

The TEACHERS map in index.html specifies class code, spreadsheet ID and Apps Script endpoint. Missing class parameters use the documented IP5/9 default; invalid explicit parameters fail closed. Keep existing school links and routing IDs.

## Receiver compatibility for eventual promotion

The updated factflow-apps-script.gs and FactFlow's factflow-practice-apps-script.gs are identical. Install either complete file in each existing Apps Script project, save, then update the existing deployment to a new version. Keep its endpoint and access settings unchanged. This step is not necessary to use the local-only preview.

The new receiver supports schema 2 and schema 3. Schema 3 records are separated into Check v3 and Check Raw v3; existing Check, Raw Data, FactFlow Practice and Practice Raw Data remain intact. Literal-cell handling, strict spreadsheet routing, assessment IDs, deduplication, stale-result protection and exact acknowledgments are retained. Complete JSON evidence is stored in the hidden raw tab.

Preview-only results are not queued for automatic later submission. Export them during the pilot. Promoting the app does not retroactively change or rescore those results.

Run node test.cjs before deployment. Follow PILOT.md before making this version the default. The existing teacher passphrase remains unchanged; classroom codes and passphrase protection are not strong authentication.
