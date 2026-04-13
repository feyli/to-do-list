import { FunctionComponent, useState } from 'react';
import { Task as TaskType } from '../../models/Task';
import { Subset } from '../../models';
import { MdAdd, MdCheck, MdClose, MdEdit, MdExpandLess, MdExpandMore } from 'react-icons/md';
import { iconComponentMap } from '../../utils/iconMap';
import './Task.css';

interface TaskProps {
    task: TaskType;
    subsets: Subset[];
    allSubsets: Subset[];
    attachedSubsetIds: number[];
    isExpanded: boolean;
    onToggleExpand: () => void;
    onUpdateTask: (id: number, updates: Partial<TaskType>) => void;
    onAddRelation: (taskId: number, subsetId: number) => void;
    onFilterBySubset: (subsetId: number) => void;
}

const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
};

const TaskCard: FunctionComponent<TaskProps> = ({
                                                    task,
                                                    subsets,
                                                    allSubsets,
                                                    attachedSubsetIds,
                                                    isExpanded,
                                                    onToggleExpand,
                                                    onUpdateTask,
                                                    onAddRelation,
                                                    onFilterBySubset,
                                                }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(task.name);
    const [editDescription, setEditDescription] = useState(task.description);
    const [editDeadline, setEditDeadline] = useState(
        task.deadlineDate.toISOString().split('T')[0]
    );
    const [showSubsetDropdown, setShowSubsetDropdown] = useState(false);

    const availableSubsets = allSubsets.filter(s => !attachedSubsetIds.includes(s.id));

    const handleSave = () => {
        if (editName.length < 5) return;
        onUpdateTask(task.id, {
            name: editName,
            description: editDescription,
            deadlineDate: new Date(editDeadline),
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditName(task.name);
        setEditDescription(task.description);
        setEditDeadline(task.deadlineDate.toISOString().split('T')[0]);
        setIsEditing(false);
    };

    const handleAddSubset = (subsetId: number) => {
        onAddRelation(task.id, subsetId);
        setShowSubsetDropdown(false);
    };

    const displaySubsets = isExpanded ? subsets : subsets.slice(0, 2);
    const hasMoreSubsets = !isExpanded && subsets.length > 2;

    return (
        <div className="task-card">
            <div className="task-card-main" onClick={onToggleExpand}>
                <div className="task-card-left">
                    <div className="task-status-dot" style={{backgroundColor: getStatusColor(task.status)}}/>
                    <div className="task-info">
                        <span className="task-name">{task.name}</span>
                        <span className="task-deadline">{formatDate(task.deadlineDate)}</span>
                    </div>
                </div>
                <div className="task-card-right">
                    <div className="task-subsets">
                        {displaySubsets.map(subset => (
                            <span
                                key={subset.id}
                                className="subset-chip"
                                style={{backgroundColor: subset.color + '20', color: subset.color, borderColor: subset.color}}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onFilterBySubset(subset.id);
                                }}
                            >
                                {subset.icon && iconComponentMap[subset.icon] && (
                                    <span className="subset-chip-icon">
                                        {(() => {
                                            const Icon = iconComponentMap[subset.icon];
                                            return <Icon/>;
                                        })()}
                                    </span>
                                )}
                                {subset.name}
                            </span>
                        ))}
                        {hasMoreSubsets && (
                            <span className="subset-chip-more">+{subsets.length - 2}</span>
                        )}
                    </div>
                    <button className="task-expand-btn" onClick={(e) => {
                        e.stopPropagation();
                        onToggleExpand();
                    }}>
                        {isExpanded ? <MdExpandLess/> : <MdExpandMore/>}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="task-expanded">
                    {isEditing ? (
                        <div className="task-edit-form">
                            <div className="form-field">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className={editName.length < 5 ? 'input-error' : ''}
                                />
                                {editName.length < 5 && (
                                    <span className="field-error">Min 5 characters</span>
                                )}
                            </div>
                            <div className="form-field">
                                <label>Description</label>
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className="form-field">
                                <label>Deadline</label>
                                <input
                                    type="date"
                                    value={editDeadline}
                                    onChange={(e) => setEditDeadline(e.target.value)}
                                />
                            </div>
                            <div className="task-edit-actions">
                                <button className="btn-save" onClick={handleSave} disabled={editName.length < 5}>
                                    <MdCheck/> Save
                                </button>
                                <button className="btn-cancel" onClick={handleCancel}>
                                    <MdClose/> Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {task.description && (
                                <p className="task-description">{task.description}</p>
                            )}
                            {task.coworkerList.length > 0 && (
                                <div className="task-coworkers">
                                    <span className="coworkers-label">Coworkers:</span>
                                    {task.coworkerList.map((cw, i) => (
                                        <span key={i} className="coworker-chip">{cw}</span>
                                    ))}
                                </div>
                            )}
                            <div className="task-expanded-actions">
                                <button className="btn-edit" onClick={() => setIsEditing(true)}>
                                    <MdEdit/> Edit
                                </button>
                                <div className="add-subset-wrapper">
                                    <button
                                        className="btn-add-subset"
                                        onClick={() => setShowSubsetDropdown(!showSubsetDropdown)}
                                        disabled={availableSubsets.length === 0}
                                    >
                                        <MdAdd/> Add subset
                                    </button>
                                    {showSubsetDropdown && availableSubsets.length > 0 && (
                                        <div className="subset-dropdown">
                                            {availableSubsets.map(s => (
                                                <button
                                                    key={s.id}
                                                    className="subset-dropdown-item"
                                                    onClick={() => handleAddSubset(s.id)}
                                                >
                                                    <span className="subset-dot" style={{backgroundColor: s.color}}/>
                                                    {s.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        'New': '#3B82F6',
        'In progress': '#EAB308',
        'Waiting': '#F97316',
        'Succeeded': '#22C55E',
        'Abandoned': '#6B7280',
    };
    return colors[status] || '#6B7280';
}

export default TaskCard;
