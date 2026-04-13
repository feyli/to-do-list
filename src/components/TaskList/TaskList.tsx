import { FunctionComponent, useState } from 'react';
import { Subset, Task } from '../../models';
import { Relation } from '../../types/Relation';
import TaskCard from '../Task/Task';
import './TaskList.css';

interface TaskListProps {
    tasks: Task[];
    subsets: Subset[];
    relations: Relation[];
    onUpdateTask: (id: number, updates: Partial<Task>) => void;
    onAddRelation: (taskId: number, subsetId: number) => void;
    onFilterBySubset: (subsetId: number) => void;
}

const TaskList: FunctionComponent<TaskListProps> = ({
                                                        tasks,
                                                        subsets,
                                                        relations,
                                                        onUpdateTask,
                                                        onAddRelation,
                                                        onFilterBySubset,
                                                    }) => {
    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

    const toggleExpand = (taskId: number) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(taskId)) {
                next.delete(taskId);
            } else {
                next.add(taskId);
            }
            return next;
        });
    };

    const getSubsetsForTask = (taskId: number): Subset[] => {
        const subsetIds = relations
            .filter(r => r.taskId === taskId)
            .map(r => r.subsetId);
        return subsets.filter(s => subsetIds.includes(s.id));
    };

    const getAttachedSubsetIds = (taskId: number): number[] => {
        return relations
            .filter(r => r.taskId === taskId)
            .map(r => r.subsetId);
    };

    if (tasks.length === 0) {
        return (
            <div className="task-list-empty">
                <p>No tasks to display</p>
            </div>
        );
    }

    return (
        <div className="task-list">
            {tasks.map(task => (
                <TaskCard
                    key={task.id}
                    task={task}
                    subsets={getSubsetsForTask(task.id)}
                    allSubsets={subsets}
                    attachedSubsetIds={getAttachedSubsetIds(task.id)}
                    isExpanded={expandedIds.has(task.id)}
                    onToggleExpand={() => toggleExpand(task.id)}
                    onUpdateTask={onUpdateTask}
                    onAddRelation={onAddRelation}
                    onFilterBySubset={onFilterBySubset}
                />
            ))}
        </div>
    );
};

export default TaskList;
