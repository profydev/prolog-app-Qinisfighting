export enum IssueLevel {
  info = "info",
  warning = "warning",
  error = "error",
}

export type Issue = {
  id: string;
  projectId: string;
  name: string;
  message: string;
  stack: string;
  status: string;
  level: IssueLevel;
  numEvents: number;
  numUsers: number;
};
