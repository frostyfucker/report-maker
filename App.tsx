
import React, { useState, useCallback } from 'react';
import {
  SparklesIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckBadgeIcon,
  XCircleIcon,
  ListBulletIcon,
  ChartBarIcon,
  CodeBracketIcon,
  CloudIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon
} from '@heroicons/react/24/solid';
import { analyzeProjectReview } from './services/geminiService';
import KanbanBoard from './components/KanbanBoard';
import { exportReportAsHtml } from './components/ReportExporter';
import type { AiReport, RecentActivity } from './types';

const ActivityIcon: React.FC<{ type: RecentActivity['type'] }> = ({ type }) => {
  switch (type) {
    case 'commit':
      return <CodeBracketIcon className="h-5 w-5 text-violet-400" />;
    case 'file_change':
      return <DocumentTextIcon className="h-5 w-5 text-gray-400" />;
    case 'deploy':
      return <CloudIcon className="h-5 w-5 text-sky-400" />;
    default:
      return <SparklesIcon className="h-5 w-5 text-white" />;
  }
};

const App: React.FC = () => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [aiReport, setAiReport] = useState<AiReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileContent(null);
      setAiReport(null);
      setError(null);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target?.result as string);
      };
      reader.onerror = () => {
        setError('Error reading the file.');
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!fileContent) {
      setError('Please upload a file first.');
      return;
    }
    setIsLoading(true);
    setAiReport(null);
    setError(null);

    try {
      const result = await analyzeProjectReview(fileContent);
      setAiReport(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [fileContent]);
  
  return (
    <div className="min-h-screen bg-slate-900 text-white antialiased p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 border-b border-slate-800 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
            <SparklesIcon className="w-8 h-8 text-violet-500" />
            <span>Project Dashboard AI</span>
          </h1>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 w-full sm:w-auto">
            <label className="flex items-center space-x-2 px-5 py-3 bg-violet-600 hover:bg-violet-700 transition-colors rounded-lg shadow-lg cursor-pointer font-semibold">
              <DocumentTextIcon className="w-5 h-5" />
              <span>{fileName || 'Upload Review File'}</span>
              <input type="file" onChange={handleFileUpload} className="hidden" accept=".txt,.md" />
            </label>
            {fileContent && (
              <button
                onClick={handleAnalyze}
                className="flex items-center space-x-2 px-5 py-3 rounded-lg shadow-lg transition-colors font-semibold bg-lime-600 hover:bg-lime-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                )}
                <span>{isLoading ? 'Analyzing...' : 'Generate Dashboard'}</span>
              </button>
            )}
            {aiReport && (
              <button
                onClick={() => exportReportAsHtml(aiReport)}
                className="flex items-center space-x-2 px-5 py-3 bg-sky-600 hover:bg-sky-700 transition-colors rounded-lg shadow-lg font-semibold"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                <span>Export HTML</span>
              </button>
            )}
          </div>
        </header>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg shadow-lg my-8">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {aiReport ? (
          <main className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-100">{aiReport.report_title}</h2>
            <p className="text-slate-300 max-w-4xl">{aiReport.project_summary}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1 bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-200">Project Health</h3>
                  {aiReport.project_health_status?.ci_cd_passed ? <CheckBadgeIcon className="h-7 w-7 text-green-400" /> : <XCircleIcon className="h-7 w-7 text-red-500" />}
                </div>
                <div className="space-y-3 text-sm text-slate-400">
                  <p><span className="font-semibold text-slate-200">Status:</span> {aiReport.project_health_status?.status_message}</p>
                  <p><span className="font-semibold text-slate-200">Deployment:</span> {aiReport.project_health_status?.deployment_status}</p>
                  <p><span className="font-semibold text-slate-200">Last Branch:</span> <span className="font-mono text-violet-300">{aiReport.project_health_status?.last_deployed_branch}</span></p>
                </div>
              </div>
              
              <div className="col-span-1 bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700">
                <h3 className="text-xl font-bold mb-4 text-slate-200">Key Metrics</h3>
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-center gap-2"><ChartBarIcon className="h-5 w-5 text-yellow-400" /><span className="font-medium text-slate-300">Files Changed</span></div>
                    <span className="ml-auto text-2xl font-bold">{aiReport.key_metrics?.files_changed_today ?? 0}</span>
                  </div>
                   <div className="flex items-baseline justify-between gap-2">
                     <div className="flex items-center gap-2"><CodeBracketIcon className="h-5 w-5 text-lime-400" /><span className="font-medium text-slate-300">Total Commits</span></div>
                    <span className="ml-auto text-2xl font-bold">{aiReport.key_metrics?.total_commits ?? 0}</span>
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-center gap-2"><ListBulletIcon className="h-5 w-5 text-sky-400" /><span className="font-medium text-slate-300">New Repos</span></div>
                    <span className="ml-auto text-2xl font-bold">{aiReport.key_metrics?.new_repositories ?? 0}</span>
                  </div>
                </div>
              </div>

              <div className="col-span-1 bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700">
                <h3 className="text-xl font-bold mb-4 text-slate-200">Recent Activity</h3>
                <ul className="space-y-4">
                  {(aiReport.recent_activity_timeline || []).map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="mt-1 flex-shrink-0"><ActivityIcon type={item.type} /></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{item.description}</p>
                        <p className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleString()}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700">
              <h2 className="text-2xl font-bold mb-4 text-slate-200">Understanding the Report</h2>
              <h3 className="text-xl font-semibold mb-2 text-slate-300">What Really Matters</h3>
              <p className="text-slate-400 mb-4">{aiReport.understanding_the_report?.what_matters_summary}</p>
              <h3 className="text-xl font-semibold mb-2 text-slate-300">Actionable Insights</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                {(aiReport.understanding_the_report?.actionable_insights || []).map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-200">
                <ListBulletIcon className="h-6 w-6 text-violet-400" />
                Task Board
              </h2>
              <KanbanBoard tasks={aiReport.kanban_tasks || []} />
            </div>
          </main>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-slate-800/50 rounded-lg shadow-lg border-2 border-dashed border-slate-700 mt-8">
            <p className="text-xl text-slate-400 text-center">Your intelligent project dashboard awaits.</p>
            <p className="text-slate-500 text-center mt-2">Upload a daily review file and click "Generate Dashboard" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
