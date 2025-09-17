
export interface ProjectHealthStatus {
  status_message: string;
  ci_cd_passed: boolean;
  deployment_status: string;
  last_deployed_branch: string;
}

export interface KeyMetrics {
  files_changed_today: number;
  total_commits: number;
  new_repositories: number;
}

export interface RecentActivity {
  type: 'commit' | 'file_change' | 'deploy' | 'new_repo';
  description: string;
  timestamp: string;
  details?: {
    branch?: string;
    status?: string;
  };
}

export interface KanbanTask {
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  assignee: string;
}

export interface UnderstandingReport {
  what_matters_summary: string;
  actionable_insights: string[];
}

export interface AiReport {
  report_title: string;
  project_summary: string;
  project_health_status: ProjectHealthStatus;
  key_metrics: KeyMetrics;
  recent_activity_timeline: RecentActivity[];
  kanban_tasks: KanbanTask[];
  understanding_the_report: UnderstandingReport;
}
