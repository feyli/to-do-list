import { FunctionComponent } from 'react';
import { Subset } from '../../models';
import { StatusEnum } from '../../types/StatusEnum';
import { MdArrowDownward, MdArrowUpward } from 'react-icons/md';
import { statusColors } from '../../utils/statusColors';
import './FilterBar.css';

type SortField = 'deadlineDate' | 'creationDate' | 'name';

interface FilterBarProps {
    sortField: SortField;
    sortDirection: 'asc' | 'desc';
    onSortFieldChange: (field: SortField) => void;
    onSortDirectionChange: () => void;
    filterSubsets: number[];
    onFilterSubsetsChange: (subsetIds: number[]) => void;
    filterStatuses: StatusEnum[];
    onFilterStatusesChange: (statuses: StatusEnum[]) => void;
    activePreset: boolean;
    onActivePresetToggle: () => void;
    subsets: Subset[];
}

const sortFieldLabels: Record<SortField, string> = {
    deadlineDate: 'Deadline',
    creationDate: 'Created',
    name: 'Name',
};

const allStatuses = Object.values(StatusEnum);

const FilterBar: FunctionComponent<FilterBarProps> = ({
                                                          sortField,
                                                          sortDirection,
                                                          onSortFieldChange,
                                                          onSortDirectionChange,
                                                          filterSubsets,
                                                          onFilterSubsetsChange,
                                                          filterStatuses,
                                                          onFilterStatusesChange,
                                                          activePreset,
                                                          onActivePresetToggle,
                                                          subsets,
                                                      }) => {
    const toggleSubsetFilter = (subsetId: number) => {
        if (filterSubsets.includes(subsetId)) {
            onFilterSubsetsChange(filterSubsets.filter(id => id !== subsetId));
        } else {
            onFilterSubsetsChange([...filterSubsets, subsetId]);
        }
    };

    const toggleStatusFilter = (status: StatusEnum) => {
        if (filterStatuses.includes(status)) {
            onFilterStatusesChange(filterStatuses.filter(s => s !== status));
        } else {
            onFilterStatusesChange([...filterStatuses, status]);
        }
    };

    return (
        <div className="filter-bar">
            <div className="filter-section">
                <span className="filter-label">Sort</span>
                <div className="sort-controls">
                    {(Object.keys(sortFieldLabels) as SortField[]).map(field => (
                        <button
                            key={field}
                            className={`sort-pill ${sortField === field ? 'sort-pill-active' : ''}`}
                            onClick={() => onSortFieldChange(field)}
                        >
                            {sortFieldLabels[field]}
                        </button>
                    ))}
                    <button className="sort-direction-btn" onClick={onSortDirectionChange}>
                        {sortDirection === 'asc' ? <MdArrowUpward/> : <MdArrowDownward/>}
                    </button>
                </div>
            </div>

            <div className="filter-section">
                <span className="filter-label">Filter</span>
                <div className="filter-controls">
                    <button
                        className={`filter-pill ${activePreset ? 'filter-pill-active' : ''}`}
                        onClick={onActivePresetToggle}
                    >
                        Active
                    </button>

                    {!activePreset && (
                        <div className="filter-group">
                            {allStatuses.map(status => (
                                <button
                                    key={status}
                                    className={`filter-pill filter-pill-status ${filterStatuses.includes(status) ? 'filter-pill-active' : ''}`}
                                    onClick={() => toggleStatusFilter(status)}
                                >
                                    <span className="filter-dot" style={{backgroundColor: statusColors[status]}}/>
                                    {status}
                                </button>
                            ))}
                        </div>
                    )}

                    {subsets.length > 0 && (
                        <div className="filter-group">
                            {subsets.map(subset => (
                                <button
                                    key={subset.id}
                                    className={`filter-pill filter-pill-subset ${filterSubsets.includes(subset.id) ? 'filter-pill-active' : ''}`}
                                    onClick={() => toggleSubsetFilter(subset.id)}
                                >
                                    <span className="filter-dot" style={{backgroundColor: subset.color}}/>
                                    {subset.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
