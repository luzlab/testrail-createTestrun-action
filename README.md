# Create Testrail testrun for PR

This action the basic structure for organizing tests on a per PR basis. When a PR is
opened, this action creates a new testrun in Testrail and adds a comment to the pullrequest.
The testrun description and the pullrequest comment contain information that's
used by later actions. 

## Inputs

### `testrail_project`

**Required** The ID of the TestRail project the test run should be added to.

### `testrail_suite`

**Required** The ID of the Test Suite for the test run.

### `testrail_URL`

The URL of the TestRail server. Default `"https://gs3.testrail.io"`.

## Example usage

uses: luzlab/testrail-createTestRun-action@v1
with:
  testrail_token: ${{ secrets.TESTRAIL_TOKEN }}
  github_token: ${{ secrets.GITHUB_TOKEN }}
  testrail_user: 0cd6ff85.thermofisher.onmicrosoft.com@amer.teams.ms
  testrail_suite: 25
  testrail_project: 7