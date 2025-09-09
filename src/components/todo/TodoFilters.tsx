import { TodoStatus } from '@/types/todo';

interface TodoFiltersProps {
  currentStatus: TodoStatus;
  onStatusChange: (status: TodoStatus) => void;
  activeCount: number;
  completedCount: number;
}

export const TodoFilters = ({ currentStatus, onStatusChange, activeCount, completedCount }: TodoFiltersProps) => {
  const filters: { value: TodoStatus; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: activeCount + completedCount },
    { value: 'active', label: 'Active', count: activeCount },
    { value: 'completed', label: 'Completed', count: completedCount },
  ];

  return (
    <div className="flex gap-2">
      {filters.map(({ value, label, count }) => (
        <button
          key={value}
          onClick={() => onStatusChange(value)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            currentStatus === value
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {label} ({count})
        </button>
      ))}
    </div>
  );
};