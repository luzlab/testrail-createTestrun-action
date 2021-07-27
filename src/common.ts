import * as core from '@actions/core';
import { GitHub } from '@actions/github/lib/utils';
import TestrailApiClient from 'testrail-api';

export const statusContext = "Testrail";

export interface testrunInfo {
  pullrequestNumber: number;
  pullrequestLink: string;
  repoOwner: string;
  repoName: string;
}

export interface pullrequestInfo {
  testrunID: number;
  testrunURL: string;
}

export interface sdks {
  testrail: TestrailApiClient;
  octokit: InstanceType<typeof GitHub>;
  core: typeof core;
}

export interface eventData {
  pullrequestNumber: number;
  pullrequestTitle: string;
  pullrequestLink: string;
  pullrequestDescription: string;
  commitSHA: string;
  repoName: string;
  repoOwner: string;
  testrailSuite: number;
  testrailProject: number;
}

export interface testrailContext {
  env: {
    is_hosted: boolean;
    page_base: string;
    resource_base: string;
  };
  context: {
    project: {
      id: number;
      name: string;
    };
    run: {
      blocked_count: number;
      completed_on: number | null;
      config: null;
      created_by: number;
      created_on: number;
      custom_status1_count: number;
      custom_status2_count: number;
      custom_status3_count: number;
      custom_status4_count: number;
      custom_status5_count: number;
      custom_status6_count: number;
      custom_status7_count: number;
      failed_count: number;
      id: number;
      is_completed: boolean;
      name: string;
      passed_count: number;
      retest_count: number;
      untested_count: number;
    };
    suite: {
      id: number;
      name: string;
    };
    user: {
      email: string;
      id: number;
      is_admin: boolean;
      name: string;
      role_id: number;
    };
  };
}
