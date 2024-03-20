/* eslint-disable @next/next/no-img-element */
import React, { ChangeEvent } from "react";
import { useRouter } from "next/router";
import { ProjectLanguage } from "@api/projects.types";
import { useGetProjects } from "@features/projects";
import { useGetIssues } from "../../api/use-get-issues";
import { IssueRow } from "./issue-row";
import styles from "./issue-list.module.scss";
import Loader from "features/ui/loader/loader";

export function IssueList() {
  const [formData, setFormData] = React.useState({
    state: "",
    level: "",
    search: "",
  });

  const router = useRouter();
  const page = Number(router.query.page || 1);
  const navigateToPage = (newPage: number) =>
    router.push({
      pathname: router.pathname,
      query: { page: newPage },
    });

  const issuesPage = useGetIssues(page);
  const projects = useGetProjects();
  const { items, meta } = issuesPage.data || {};
  const [filteredIssues, setFilteredIssues] = React.useState(items);
  if (projects.isLoading || issuesPage.isLoading) {
    return <Loader />;
  }

  if (projects.isError) {
    console.error(projects.error);
    return <div>Error loading projects: {projects.error.message}</div>;
  }

  if (issuesPage.isError) {
    console.error(issuesPage.error);
    return <div>Error loading issues: {issuesPage.error.message}</div>;
  }

  const projectIdToLanguage = (projects.data || []).reduce(
    (prev, project) => ({
      ...prev,
      [project.id]: project.language,
    }),
    {} as Record<string, ProjectLanguage>,
  );

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // console.log(formData);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(formData);
    setFilteredIssues(
      items?.filter((issue) => {
        let state = true;
        let level = true;
        let search = true;
        if (formData.state) {
          state = issue.status === formData.state;
        }
        if (formData.level) {
          level = issue.level === formData.level;
        }
        if (formData.search) {
          search = issue.name
            .toLowerCase()
            .includes(formData.search.toLowerCase());
        }
        return state && level && search;
      }),
    );
  }

  return (
    <>
      <form className={styles.issueFilter} onSubmit={handleSubmit}>
        <button className={styles.issueFilterButton}>
          <img src="/icons/check.svg" alt="check" />
          <div>Resolve selected issues</div>
        </button>
        <div className={styles.issueFilterDropdown}>
          <select name="state" value={formData.state} onChange={handleChange}>
            <option value="">- status -</option>
            <option value="resolved">Resolved</option>
            <option value="open">Unresolved</option>
          </select>
          <select name="level" value={formData.level} onChange={handleChange}>
            <option value="">- level -</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
          <div className={styles.issueFilterDropdownSearch}>
            <img src="/icons/search.svg" alt="search" />
            <input
              type="search"
              name="search"
              value={formData.search}
              placeholder="Project Name"
              onChange={handleChange}
            />
          </div>
        </div>
      </form>
      <div className={styles.container}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th className={styles.headerCell}>Issue</th>
              <th className={styles.headerCell}>Level</th>
              <th className={styles.headerCell}>Events</th>
              <th className={styles.headerCell}>Users</th>
            </tr>
          </thead>
          <tbody>
            {(filteredIssues || []).map((issue) => (
              <IssueRow
                key={issue.id}
                issue={issue}
                projectLanguage={projectIdToLanguage[issue.projectId]}
              />
            ))}
          </tbody>
        </table>
        <div className={styles.paginationContainer}>
          <div>
            <button
              className={styles.paginationButton}
              onClick={() => navigateToPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              className={styles.paginationButton}
              onClick={() => navigateToPage(page + 1)}
              disabled={page === meta?.totalPages}
            >
              Next
            </button>
          </div>
          <div className={styles.pageInfo}>
            Page <span className={styles.pageNumber}>{meta?.currentPage}</span>{" "}
            of <span className={styles.pageNumber}>{meta?.totalPages}</span>
          </div>
        </div>
      </div>
    </>
  );
}
