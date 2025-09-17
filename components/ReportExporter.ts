import type { AiReport } from '../types';

const getHealthIconSvg = (passed: boolean) => {
    return passed
        ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6 text-green-400"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.815a.75.75 0 01.99 1.144l-3 2.5a.75.75 0 01-1.059.055l-1.5-1.5a.75.75 0 011.06-1.06l1.01 1.01 2.489-2.073z" clip-rule="evenodd" /></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6 text-red-500"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clip-rule="evenodd" /></svg>`;
};

const getActivityIconSvg = (type: string) => {
    switch (type) {
        case 'commit': return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4 text-violet-400"><path fill-rule="evenodd" d="M14.47 2.47a.75.75 0 011.06 0l6 6a.75.75 0 010 1.06l-6 6a.75.75 0 01-1.06-1.06L19.94 12 14.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M9.53 2.47a.75.75 0 00-1.06 0l-6 6a.75.75 0 000 1.06l6 6a.75.75 0 001.06-1.06L4.06 12l5.47-5.47a.75.75 0 000-1.06z" clip-rule="evenodd" /></svg>`;
        case 'file_change': return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4 text-gray-400"><path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a.375.375 0 01-.375-.375V6.75A3.75 3.75 0 0010.5 3h-4.875z" /><path d="M14.25 1.5a.75.75 0 00-.75.75v4.5a.75.75 0 00.75.75h4.5a.75.75 0 000-1.5h-3.75V2.25a.75.75 0 00-.75-.75z" /></svg>`;
        case 'deploy': return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4 text-sky-400"><path fill-rule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clip-rule="evenodd" /></svg>`;
        default: return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4 text-white"><path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.5a.75.75 0 001 .707A9.716 9.716 0 006 21v-2.182a.75.75 0 01.18-.477l2.29-2.29a.75.75 0 011.06 0l2.29 2.29a.75.75 0 01.18.477V21a9.716 9.716 0 003.25-.555.75.75 0 00.5-.707V4.262a.75.75 0 00-1-.707A9.707 9.707 0 0012.75 3c-1.66 0-3.21.43-4.5 1.18v.353z" /></svg>`;
    }
};

const generateHtmlContent = (aiReport: AiReport): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${aiReport.report_title || 'Project Report'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style> body { font-family: 'Inter', sans-serif; } </style>
</head>
<body class="bg-slate-900 text-white font-sans antialiased">
  <div class="max-w-7xl mx-auto p-4 sm:p-8">
    <h1 class="text-4xl font-bold tracking-tight mb-2 text-slate-100">${aiReport.report_title || 'Untitled Report'}</h1>
    <p class="text-lg text-slate-400 mb-8">${aiReport.project_summary || 'No project summary provided.'}</p>
    
    <div class="space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Project Health Card -->
        <div class="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-slate-200">Project Health</h3>
            ${getHealthIconSvg(aiReport.project_health_status?.ci_cd_passed)}
          </div>
          <div class="space-y-3 text-sm text-slate-400">
            <p><span class="font-semibold text-white">Status:</span> ${aiReport.project_health_status?.status_message || 'N/A'}</p>
            <p><span class="font-semibold text-white">Deployment:</span> ${aiReport.project_health_status?.deployment_status || 'N/A'}</p>
            <p><span class="font-semibold text-white">Last Branch:</span> <span class="font-mono text-violet-300">${aiReport.project_health_status?.last_deployed_branch || 'N/A'}</span></p>
          </div>
        </div>
        
        <!-- Key Metrics -->
        <div class="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h3 class="text-xl font-bold mb-4 text-slate-200">Key Metrics</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-baseline"><span class="font-medium text-slate-300">Files Changed Today</span><span class="text-2xl font-bold text-yellow-400">${aiReport.key_metrics?.files_changed_today ?? 0}</span></div>
            <div class="flex justify-between items-baseline"><span class="font-medium text-slate-300">Total Commits</span><span class="text-2xl font-bold text-lime-400">${aiReport.key_metrics?.total_commits ?? 0}</span></div>
            <div class="flex justify-between items-baseline"><span class="font-medium text-slate-300">New Repositories</span><span class="text-2xl font-bold text-sky-400">${aiReport.key_metrics?.new_repositories ?? 0}</span></div>
          </div>
        </div>

        <!-- Recent Activity Timeline -->
        <div class="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h3 class="text-xl font-bold mb-4 text-slate-200">Recent Activity</h3>
          <ul class="space-y-4">
            ${(aiReport.recent_activity_timeline || []).map(item => `
              <li class="flex items-start space-x-3">
                <div class="mt-1 flex-shrink-0">${getActivityIconSvg(item.type)}</div>
                <div class="flex-1"><p class="text-sm font-semibold text-white">${item.description}</p><p class="text-xs text-slate-500">${new Date(item.timestamp).toLocaleString()}</p></div>
              </li>`).join('')}
          </ul>
        </div>
      </div>

      <!-- Understanding the Report -->
      <div class="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
        <h2 class="text-2xl font-bold mb-4 text-slate-200">Understanding the Report</h2>
        <h3 class="text-xl font-semibold mb-2 text-slate-300">What Really Matters</h3>
        <p class="text-slate-400 mb-4">${aiReport.understanding_the_report?.what_matters_summary || 'No summary provided.'}</p>
        <h3 class="text-xl font-semibold mb-2 text-slate-300">Actionable Insights</h3>
        <ul class="list-disc list-inside space-y-1 text-slate-400">
          ${(aiReport.understanding_the_report?.actionable_insights || []).map(insight => `<li>${insight}</li>`).join('')}
        </ul>
      </div>
      
      <!-- Kanban Board -->
      <div class="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
        <h2 class="text-2xl font-bold mb-6 text-slate-200">Task Board</h2>
        <div class="flex flex-col md:flex-row gap-4">
          ${['To Do', 'In Progress', 'Done'].map(status => `
            <div class="flex-1 bg-slate-900/50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold mb-4 text-slate-300">${status}</h3>
              <div class="space-y-4">
                ${(aiReport.kanban_tasks || []).filter(task => task.status === status).map(task => `
                  <div class="bg-slate-800 p-3 rounded-lg border border-slate-700">
                    <h4 class="font-bold text-violet-400">${task.title}</h4>
                    <p class="text-sm text-slate-400 mt-1">${task.description}</p>
                    <p class="text-xs text-slate-500 mt-2">Assignee: <span class="font-medium text-slate-300">${task.assignee}</span></p>
                  </div>`).join('')}
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
};

export const exportReportAsHtml = (aiReport: AiReport | null) => {
    if (!aiReport) {
        alert("No report data to export.");
        return;
    }

    const htmlContent = generateHtmlContent(aiReport);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'project_report.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};