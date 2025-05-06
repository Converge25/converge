import { useState } from "react";

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: "primary" | "secondary" | "accent" | "warning";
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
}

export default function TaskList({ tasks, onTaskToggle }: TaskListProps) {
  const priorityColors = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    accent: "bg-accent",
    warning: "bg-status-warning"
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-neutral-lightest">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Upcoming Tasks</h3>
        <button className="text-neutral-medium hover:text-primary">
          <i className="ri-add-line"></i>
        </button>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="p-3 border border-neutral-lightest rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <input 
                  type="checkbox" 
                  checked={task.completed}
                  onChange={() => onTaskToggle(task.id)}
                  className="h-4 w-4 rounded border-neutral-light text-primary focus:ring-primary"
                />
              </div>
              <div className="ml-3 flex-1">
                <div className={`text-sm font-medium ${task.completed ? 'line-through text-neutral-medium' : ''}`}>
                  {task.title}
                </div>
                <div className="text-xs text-neutral-medium mt-1">Due: {task.dueDate}</div>
              </div>
              <div className="ml-2 flex-shrink-0">
                <span className={`inline-block h-6 w-1 rounded-full ${priorityColors[task.priority]}`}></span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <button className="w-full py-2 text-center text-sm font-medium text-primary hover:text-primary-dark border border-primary rounded-md hover:bg-primary-light">
          View All Tasks
        </button>
      </div>
    </div>
  );
}
