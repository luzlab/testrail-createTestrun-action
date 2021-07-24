# Create Testrail testrun for PR

This action the basic structure for organizing tests on a per PR basis. When a PR is
opened, this action creates a new testrun in Testrail and adds a comment to the pullrequest.
The testrun description and the pullrequest comment contain information that's
used by later actions. 

## Inputs

### `testrail_project`

**Required** The ID of the Testrail project the testrun should be added to.

### `testrail_suite`

**Required** The testsuite ID that contains all the acceptance test. No testcases will
be added to the testrun. Instead, testers are expected to add testcases to the testrun
manually.

### `testrail_URL`

The URL of the TestRail server. Default `"https://gs3.testrail.io"`.

### `testrail_user`

The Testrail user email.

### `testrail_token`

The token for logging into Testrail.

### `github_token`

The Github API token used to add the comment to the PR

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