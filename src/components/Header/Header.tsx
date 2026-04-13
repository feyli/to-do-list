import { FunctionComponent } from 'react';
import { Task } from '../../models';
import { StatusEnum } from '../../types/StatusEnum';
import { MdChecklist, MdFolder, MdRefresh, MdViewList } from 'react-icons/md';
import { statusColors } from '../../utils/statusColors';
import './Header.css';

interface HeaderProps {
    totalCount: number;
    activeCount: number;
    tasks: Task[];
    viewMode: 'tasks' | 'subsets';
    onToggleViewMode: () => void;
    onReset: () => void;
}

const PieChart: FunctionComponent<{ tasks: Task[] }> = ({tasks}) => {
    if (tasks.length === 0) return null;

    const statusCounts = Object.values(StatusEnum).map(status => ({
        status,
        count: tasks.filter(t => t.status === status).length,
        color: statusColors[status],
    }));

    // Filter out zero-count statuses for cleaner pie
    const nonZero = statusCounts.filter(s => s.count > 0);
    const total = tasks.length;
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return (
        <svg className="pie-chart" viewBox="0 0 40 40" width="40" height="40">
            {nonZero.map((s, i) => {
                const fraction = s.count / total;
                const dashLength = fraction * circumference;
                const dashOffset = -offset;
                offset += dashLength;
                return (
                    <circle
                        key={i}
                        cx="20"
                        cy="20"
                        r={radius}
                        fill="none"
                        stroke={s.color}
                        strokeWidth="8"
                        strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                        strokeDashoffset={dashOffset}
                        transform="rotate(-90 20 20)"
                    />
                );
            })}
        </svg>
    );
};

const Header: FunctionComponent<HeaderProps> = ({
                                                    totalCount,
                                                    activeCount,
                                                    tasks,
                                                    viewMode,
                                                    onToggleViewMode,
                                                    onReset,
                                                }) => {
    return (
        <header className="app-header">
            <div className="header-left">
                <div className="header-brand">
                    <MdChecklist className="header-icon"/>
                    <span className="header-title">To-Do List</span>
                </div>
                <div className="header-counters">
                    <span className="counter-badge counter-total">{totalCount} total</span>
                    <span className="counter-badge counter-active">{activeCount} active</span>
                </div>
            </div>
            <div className="header-right">
                <PieChart tasks={tasks}/>
                <button className="header-btn" onClick={onReset} title="Reset to initial data">
                    <MdRefresh/>
                </button>
                <button className="header-btn header-view-toggle" onClick={onToggleViewMode} title={viewMode === 'tasks' ? 'Switch to Subsets' : 'Switch to Tasks'}>
                    {viewMode === 'tasks' ? <MdFolder/> : <MdViewList/>}
                    <span>{viewMode === 'tasks' ? 'Subsets' : 'Tasks'}</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
