import { FunctionComponent, useState } from 'react';
import { Subset, Task } from '../../models';
import { Relation } from '../../types/Relation';
import { ColorEnum } from '../../types/ColorEnum';
import { IconEnum } from '../../types/IconEnum';
import { iconComponentMap } from '../../utils/iconMap';
import { MdCheck, MdClose, MdDelete, MdEdit } from 'react-icons/md';
import './SubsetList.css';

interface SubsetListProps {
    subsets: Subset[];
    relations: Relation[];
    tasks: Task[];
    onUpdateSubset: (id: number, updates: Partial<Subset>) => void;
    onDeleteSubset: (id: number) => void;
}

const allColors = Object.entries(ColorEnum) as [string, ColorEnum][];
const allIcons = Object.entries(IconEnum) as [string, IconEnum][];

const SubsetList: FunctionComponent<SubsetListProps> = ({
                                                            subsets,
                                                            relations,
                                                            tasks,
                                                            onUpdateSubset,
                                                            onDeleteSubset,
                                                        }) => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editColor, setEditColor] = useState<ColorEnum>(ColorEnum.GRAY);
    const [editIcon, setEditIcon] = useState<IconEnum | ''>('');
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const getTaskCount = (subsetId: number): number => {
        return relations.filter(r => r.subsetId === subsetId).length;
    };

    const getTasksForSubset = (subsetId: number): Task[] => {
        const taskIds = relations.filter(r => r.subsetId === subsetId).map(r => r.taskId);
        return tasks.filter(t => taskIds.includes(t.id));
    };

    const startEdit = (subset: Subset) => {
        setEditingId(subset.id);
        setEditName(subset.name);
        setEditDescription(subset.description);
        setEditColor(subset.color);
        setEditIcon(subset.icon || '');
    };

    const handleSave = () => {
        if (editingId === null || editName.length < 3) return;
        onUpdateSubset(editingId, {
            name: editName,
            description: editDescription,
            color: editColor,
            icon: editIcon ? editIcon as IconEnum : undefined,
        });
        setEditingId(null);
    };

    const handleCancel = () => {
        setEditingId(null);
    };

    const handleDelete = (id: number) => {
        onDeleteSubset(id);
        setConfirmDeleteId(null);
    };

    if (subsets.length === 0) {
        return (
            <div className="subset-list-empty">
                <p>No subsets yet. Create one with the + button.</p>
            </div>
        );
    }

    return (
        <div className="subset-list">
            {subsets.map(subset => {
                const isEditing = editingId === subset.id;
                const taskCount = getTaskCount(subset.id);
                const subsetTasks = getTasksForSubset(subset.id);
                const IconComponent = subset.icon ? iconComponentMap[subset.icon] : null;

                return (
                    <div key={subset.id} className="subset-card">
                        {isEditing ? (
                            <div className="subset-edit-form">
                                <div className="form-field">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className={editName.length < 3 ? 'input-error' : ''}
                                    />
                                    {editName.length < 3 && (
                                        <span className="field-error">Min 3 characters</span>
                                    )}
                                </div>
                                <div className="form-field">
                                    <label>Description</label>
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        rows={2}
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Color</label>
                                    <div className="color-picker">
                                        {allColors.map(([key, value]) => (
                                            <button
                                                key={key}
                                                className={`color-swatch ${editColor === value ? 'color-swatch-active' : ''}`}
                                                style={{backgroundColor: value}}
                                                onClick={() => setEditColor(value)}
                                                title={key}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label>Icon</label>
                                    <select
                                        value={editIcon}
                                        onChange={(e) => setEditIcon(e.target.value as IconEnum | '')}
                                    >
                                        <option value="">None</option>
                                        {allIcons.map(([key, value]) => (
                                            <option key={key} value={value}>{key}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="subset-edit-actions">
                                    <button className="btn-save" onClick={handleSave} disabled={editName.length < 3}>
                                        <MdCheck/> Save
                                    </button>
                                    <button className="btn-cancel" onClick={handleCancel}>
                                        <MdClose/> Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="subset-card-header">
                                    <div className="subset-card-left">
                                        <div className="subset-color-swatch" style={{backgroundColor: subset.color}}/>
                                        {IconComponent && <IconComponent className="subset-card-icon"/>}
                                        <div className="subset-card-info">
                                            <span className="subset-card-name">{subset.name}</span>
                                            {subset.description && (
                                                <span className="subset-card-desc">{subset.description}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="subset-card-right">
                                        <span className="subset-task-count">{taskCount} task{taskCount !== 1 ? 's' : ''}</span>
                                        <button className="btn-edit-sm" onClick={() => startEdit(subset)}>
                                            <MdEdit/>
                                        </button>
                                        {confirmDeleteId === subset.id ? (
                                            <div className="delete-confirm">
                                                <span className="delete-confirm-text">Delete?</span>
                                                <button className="btn-delete-yes" onClick={() => handleDelete(subset.id)}>Yes</button>
                                                <button className="btn-delete-no" onClick={() => setConfirmDeleteId(null)}>No</button>
                                            </div>
                                        ) : (
                                            <button className="btn-delete-sm" onClick={() => setConfirmDeleteId(subset.id)}>
                                                <MdDelete/>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {subsetTasks.length > 0 && (
                                    <div className="subset-task-list">
                                        {subsetTasks.map(task => (
                                            <span key={task.id} className="subset-task-chip">{task.name}</span>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default SubsetList;
