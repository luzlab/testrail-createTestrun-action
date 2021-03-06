# Create Testrail testrun for PR

This action the basic structure for organizing tests on a per PR basis. When a PR is
opened, this action creates a new testrun in Testrail and adds a comment to the pullrequest.
The testrun description and the pullrequest comment contain information that's
used by later actions. 

## Screenshots
![commentscreenshot](./.images/prcomment.png)

![testrunscreenshot](./.images/testrun.png)

## Usage

### Inputs

#### `testrail_project`

**Required** The ID of the Testrail project the testrun should be added to.

#### `testrail_suite`

**Required** The testsuite ID that contains all the acceptance test. No testcases will
be added to the testrun. Instead, testers are expected to add testcases to the testrun
manually.

#### `testrail_URL`

The URL of the TestRail server. Default `"https://gs3.testrail.io"`.

#### `testrail_user`

The Testrail user email.

#### `testrail_token`

The token for logging into Testrail.

#### `github_token`

The Github API token used to add the comment to the PR

### Skipping
If the pullrequest description includes any of the following strings, this action
will _not_ create a testrun.

- `[skip testrun]`
- `[no testrun]`
- `***NO_TESTRUN***`
- `skip-testrun`

## Example usage

```
uses: luzlab/testrail-createTestRun-action@v1
with:
  testrail_token: ${{ secrets.TESTRAIL_TOKEN }}
  github_token: ${{ secrets.GITHUB_TOKEN }}
  testrail_user: testrailuser@somecompany.com
  testrail_suite: 25
  testrail_project: 7
```

## Explanation

This action handles the PR `opened`, `synchronize` and `closed` events.

- `opened` A new testrun is created in testrail and a PR status check of `pending` is added. 
- `synchronize` The PR status check is reset to `pending`.
- `closed` The testrun is closed in testrail.

## Testrail UI Script

This action includes an accompanying Testrail UI script to add an `Update PR` button to the Testrail UI. Clicking on the button updates the status check on the linked PR. 

![testrunscreenshot](./.images/uiscript.png)

The script is located in `dist/uiscript`. A Github PAT token with `repo` scope must be generated and copied
into the uiscript. Replace the string `<GITHUB_PAT>` with your PAT, then paste into Testrail as a custom UI script.

Currently, testresult status of `success` or `retest` count as passing. Any other testresult status will results in a failing PR status check and prevent merging.

## Development

Clone the repo, install node modules, and run `npm run build`. This generates both `index.js` for the Github Action and the `uiscript` for Testrail.