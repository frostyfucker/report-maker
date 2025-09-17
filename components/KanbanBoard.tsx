
import React from 'react';
import { ListBulletIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import type { KanbanTask } from '../types';

interface KanbanBoardProps {
  tasks: KanbanTask[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks }) => {
  const statuses: KanbanTask['status'][] = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {statuses.map(status => (
        <div key={status} className="flex-1 min-w-0 bg-slate-800 p-4 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-200">
            {status === 'To Do' && <ListBulletIcon className="h-5 w-5 text-gray-400" />}
            {status === 'In Progress' && <ClockIcon className="h-5 w-5 text-yellow-400" />}
            {status === 'Done' && <CheckCircleIcon className="h-5 w-5 text-green-400" />}
            {status}
          </h3>
          <div className="space-y-4">
            {tasks.filter(task => task.status === status).map((task, index) => (
              <div key={index} className="bg-slate-900 p-3 rounded-lg border border-slate-700 hover:border-violet-600 transition-colors cursor-pointer">
                <h4 className="text-md font-bold text-violet-400">{task.title}</h4>
                <p className="text-sm text-slate-400 mt-1">{task.description}</p>
                {task.assignee && (
                  <p className="text-xs text-slate-500 mt-2">
                    Assigned to: <span className="font-medium text-slate-300">{task.assignee}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
