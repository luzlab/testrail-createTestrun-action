# `Create linked TestRail TestRun for PR` GitHub Action

This action creates a Test Run in TestRail when a PR is opened. This creates the basic
structure for organizing tests on a per PR basis. 

## Inputs

## `testrail_project`

**Required** The ID of the TestRail project the test run should be added to.

## `testrail_suite`

**Required** The ID of the Test Suite for the test run.

## `testrail_URL`

The URL of the TestRail server. Default `"https://gs3.testrail.io"`.

## Outputs

## `testrun_URL`

The URL for accessing the linked Test Run.

## `testrun_ID`

The TestRail ID of the linked Test Run.

## Example usage

uses: actions/hello-world-javascript-action@v1.1
with:
  who-to-greet: 'Mona the Octocat'