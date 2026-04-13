import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { Subset, Task } from './models';
import { Relation } from './types/Relation';
import { DONE_STATUSES, StatusEnum } from './types/StatusEnum';
import { ColorEnum } from './types/ColorEnum';
import { IconEnum } from './types/IconEnum';
import { loadData } from './utils/loadData';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import FilterBar from './components/FilterBar/FilterBar';
import TaskList from './components/TaskList/TaskList';
import SubsetList from './components/SubsetList/SubsetList';
import Modal from './components/Modal/Modal';
import './App.css';

type SortField = 'deadlineDate' | 'creationDate' | 'name';

const App: FunctionComponent = () => {
    // Data state
    const [tasks, setTasks] = useState<Task[]>([]);
    const [subsets, setSubsets] = useState<Subset[]>([]);
    const [relations, setRelations] = useState<Relation[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // UI state
    const [viewMode, setViewMode] = useState<'tasks' | 'subsets'>('tasks');
    const [sortField, setSortField] = useState<SortField>('deadlineDate');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [filterSubsets, setFilterSubsets] = useState<number[]>([]);
    const [filterStatuses, setFilterStatuses] = useState<StatusEnum[]>([]);
    const [activePreset, setActivePreset] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'task' | 'subset' | null>(null);

    // Task creation form state
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskDeadline, setNewTaskDeadline] = useState('');
    const [newTaskStatus, setNewTaskStatus] = useState<StatusEnum>(StatusEnum.NEW);
    const [newTaskCoworkers, setNewTaskCoworkers] = useState('');

    // Subset creation form state
    const [newSubsetName, setNewSubsetName] = useState('');
    const [newSubsetDescription, setNewSubsetDescription] = useState('');
    const [newSubsetColor, setNewSubsetColor] = useState<ColorEnum>(ColorEnum.BLUE);
    const [newSubsetIcon, setNewSubsetIcon] = useState<IconEnum | ''>('');

    // Load data on mount
    useEffect(() => {
        loadData().then(data => {
            setTasks(data.tasks);
            setSubsets(data.subsets);
            setRelations(data.relations);
            setIsLoaded(true);
        });
    }, []);

    // CRUD callbacks
    const addTask = useCallback((task: Task) => {
        setTasks(prev => [...prev, task]);
    }, []);

    const updateTask = useCallback((id: number, updates: Partial<Task>) => {
        setTasks(prev => prev.map(t => t.id === id ? {...t, ...updates} : t));
    }, []);

    const addSubset = useCallback((subset: Subset) => {
        setSubsets(prev => [...prev, subset]);
    }, []);

    const updateSubset = useCallback((id: number, updates: Partial<Subset>) => {
        setSubsets(prev => prev.map(s => s.id === id ? {...s, ...updates} : s));
    }, []);

    const deleteSubset = useCallback((id: number) => {
        setSubsets(prev => prev.filter(s => s.id !== id));
        setRelations(prev => prev.filter(r => r.subsetId !== id));
        setFilterSubsets(prev => prev.filter(sid => sid !== id));
    }, []);

    const addRelation = useCallback((taskId: number, subsetId: number) => {
        setRelations(prev => {
            if (prev.some(r => r.taskId === taskId && r.subsetId === subsetId)) return prev;
            return [...prev, {taskId, subsetId}];
        });
    }, []);

    const resetData = useCallback(() => {
        if (!window.confirm('Are you sure? This will reset all data to the initial state.')) return;
        loadData().then(data => {
            setTasks(data.tasks);
            setSubsets(data.subsets);
            setRelations(data.relations);
        });
    }, []);

    // Filter by subset (O4)
    const handleFilterBySubset = useCallback((subsetId: number) => {
        setFilterSubsets(prev => {
            if (prev.includes(subsetId)) return prev;
            return [...prev, subsetId];
        });
        setViewMode('tasks');
    }, []);

    // Computed: filtered and sorted tasks
    const filteredTasks = useMemo(() => {
        let result = [...tasks];

        // O5: auto-hide tasks whose deadline passed > 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        result = result.filter(t => t.deadlineDate >= sevenDaysAgo);

        // Active preset filter
        if (activePreset) {
            result = result.filter(t => !DONE_STATUSES.includes(t.status));
        } else if (filterStatuses.length > 0) {
            result = result.filter(t => filterStatuses.includes(t.status));
        }

        // Subset filter
        if (filterSubsets.length > 0) {
            const taskIdsInSubsets = new Set(
                relations
                    .filter(r => filterSubsets.includes(r.subsetId))
                    .map(r => r.taskId)
            );
            result = result.filter(t => taskIdsInSubsets.has(t.id));
        }

        // Sort
        result.sort((a, b) => {
            let cmp;
            if (sortField === 'deadlineDate') {
                cmp = a.deadlineDate.getTime() - b.deadlineDate.getTime();
            } else if (sortField === 'creationDate') {
                cmp = a.creationDate.getTime() - b.creationDate.getTime();
            } else {
                cmp = a.name.localeCompare(b.name);
            }
            return sortDirection === 'asc' ? cmp : -cmp;
        });

        return result;
    }, [tasks, activePreset, filterStatuses, filterSubsets, relations, sortField, sortDirection]);

    // Counters
    const totalCount = tasks.length;
    const activeCount = tasks.filter(t => !DONE_STATUSES.includes(t.status)).length;

    // Next ID generators
    const nextTaskId = useMemo(() => {
        if (tasks.length === 0) return 101;
        return Math.max(...tasks.map(t => t.id)) + 1;
    }, [tasks]);

    const nextSubsetId = useMemo(() => {
        if (subsets.length === 0) return 201;
        return Math.max(...subsets.map(s => s.id)) + 1;
    }, [subsets]);

    // Modal handlers
    const openModal = (type: 'task' | 'subset') => {
        setModalType(type);
        setModalOpen(true);
        // Reset forms
        setNewTaskName('');
        setNewTaskDescription('');
        setNewTaskDeadline('');
        setNewTaskStatus(StatusEnum.NEW);
        setNewTaskCoworkers('');
        setNewSubsetName('');
        setNewSubsetDescription('');
        setNewSubsetColor(ColorEnum.BLUE);
        setNewSubsetIcon('');
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalType(null);
    };

    const handleCreateTask = () => {
        if (newTaskName.length < 5 || !newTaskDeadline) return;
        const coworkers = newTaskCoworkers
            .split(',')
            .map(c => c.trim())
            .filter(c => c.length > 0);
        const task: Task = {
            id: nextTaskId,
            name: newTaskName,
            description: newTaskDescription,
            creationDate: new Date(),
            deadlineDate: new Date(newTaskDeadline),
            status: newTaskStatus,
            coworkerList: coworkers,
        };
        addTask(task);
        closeModal();
    };

    const handleCreateSubset = () => {
        if (newSubsetName.length < 3) return;
        const subset: Subset = {
            id: nextSubsetId,
            name: newSubsetName,
            description: newSubsetDescription,
            color: newSubsetColor,
            icon: newSubsetIcon ? newSubsetIcon as IconEnum : undefined,
        };
        addSubset(subset);
        closeModal();
    };

    if (!isLoaded) {
        return <div className="app-loading">Loading...</div>;
    }

    const allColors = Object.entries(ColorEnum) as [string, ColorEnum][];
    const allIcons = Object.entries(IconEnum) as [string, IconEnum][];

    return (
        <div className="app">
            <Header
                totalCount={totalCount}
                activeCount={activeCount}
                tasks={tasks}
                viewMode={viewMode}
                onToggleViewMode={() => setViewMode(v => v === 'tasks' ? 'subsets' : 'tasks')}
                onReset={resetData}
            />

            <main className="app-main">
                {viewMode === 'tasks' ? (
                    <>
                        <FilterBar
                            sortField={sortField}
                            sortDirection={sortDirection}
                            onSortFieldChange={setSortField}
                            onSortDirectionChange={() => setSortDirection(d => d === 'asc' ? 'desc' : 'asc')}
                            filterSubsets={filterSubsets}
                            onFilterSubsetsChange={setFilterSubsets}
                            filterStatuses={filterStatuses}
                            onFilterStatusesChange={setFilterStatuses}
                            activePreset={activePreset}
                            onActivePresetToggle={() => setActivePreset(p => !p)}
                            subsets={subsets}
                        />
                        <TaskList
                            tasks={filteredTasks}
                            subsets={subsets}
                            relations={relations}
                            onUpdateTask={updateTask}
                            onAddRelation={addRelation}
                            onFilterBySubset={handleFilterBySubset}
                        />
                    </>
                ) : (
                    <SubsetList
                        subsets={subsets}
                        relations={relations}
                        tasks={tasks}
                        onUpdateSubset={updateSubset}
                        onDeleteSubset={deleteSubset}
                    />
                )}
            </main>

            <Footer onOpenModal={openModal}/>

            {/* Task Creation Modal */}
            <Modal
                isOpen={modalOpen && modalType === 'task'}
                onClose={closeModal}
                title="New Task"
            >
                <div className="modal-form">
                    <div className="form-field">
                        <label>Name</label>
                        <input
                            type="text"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                            placeholder="Task name (min 5 characters)"
                            className={newTaskName.length > 0 && newTaskName.length < 5 ? 'input-error' : ''}
                        />
                        {newTaskName.length > 0 && newTaskName.length < 5 && (
                            <span className="field-error">Min 5 characters</span>
                        )}
                    </div>
                    <div className="form-field">
                        <label>Description</label>
                        <textarea
                            value={newTaskDescription}
                            onChange={(e) => setNewTaskDescription(e.target.value)}
                            placeholder="Optional description"
                            rows={3}
                        />
                    </div>
                    <div className="form-field">
                        <label>Deadline</label>
                        <input
                            type="date"
                            value={newTaskDeadline}
                            onChange={(e) => setNewTaskDeadline(e.target.value)}
                        />
                    </div>
                    <div className="form-field">
                        <label>Status</label>
                        <select
                            value={newTaskStatus}
                            onChange={(e) => setNewTaskStatus(e.target.value as StatusEnum)}
                        >
                            {Object.values(StatusEnum).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label>Coworkers</label>
                        <input
                            type="text"
                            value={newTaskCoworkers}
                            onChange={(e) => setNewTaskCoworkers(e.target.value)}
                            placeholder="Comma-separated names"
                        />
                    </div>
                    <button
                        className="btn-create"
                        onClick={handleCreateTask}
                        disabled={newTaskName.length < 5 || !newTaskDeadline}
                    >
                        Create Task
                    </button>
                </div>
            </Modal>

            {/* Subset Creation Modal */}
            <Modal
                isOpen={modalOpen && modalType === 'subset'}
                onClose={closeModal}
                title="New Subset"
            >
                <div className="modal-form">
                    <div className="form-field">
                        <label>Name</label>
                        <input
                            type="text"
                            value={newSubsetName}
                            onChange={(e) => setNewSubsetName(e.target.value)}
                            placeholder="Subset name (min 3 characters)"
                            className={newSubsetName.length > 0 && newSubsetName.length < 3 ? 'input-error' : ''}
                        />
                        {newSubsetName.length > 0 && newSubsetName.length < 3 && (
                            <span className="field-error">Min 3 characters</span>
                        )}
                    </div>
                    <div className="form-field">
                        <label>Description</label>
                        <textarea
                            value={newSubsetDescription}
                            onChange={(e) => setNewSubsetDescription(e.target.value)}
                            placeholder="Optional description"
                            rows={2}
                        />
                    </div>
                    <div className="form-field">
                        <label>Color</label>
                        <div className="color-picker">
                            {allColors.map(([key, value]) => (
                                <button
                                    key={key}
                                    className={`color-swatch ${newSubsetColor === value ? 'color-swatch-active' : ''}`}
                                    style={{backgroundColor: value}}
                                    onClick={() => setNewSubsetColor(value)}
                                    title={key}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="form-field">
                        <label>Icon</label>
                        <select
                            value={newSubsetIcon}
                            onChange={(e) => setNewSubsetIcon(e.target.value as IconEnum | '')}
                        >
                            <option value="">None</option>
                            {allIcons.map(([key, value]) => (
                                <option key={key} value={value}>{key}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        className="btn-create"
                        onClick={handleCreateSubset}
                        disabled={newSubsetName.length < 3}
                    >
                        Create Subset
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default App;
