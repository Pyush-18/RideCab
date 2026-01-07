import React, { useState } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const GenericFilter = ({
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  filters = [],
  darkMode = false,
  onClearAll,
  showAdvancedFilters = true,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const activeFilterCount = filters.filter(
    (f) => f.value && f.value !== 'all' && f.value !== ''
  ).length;

  const hasActiveFilters = searchValue || activeFilterCount > 0;

  const handleClearAll = () => {
    onSearchChange?.('');
    filters.forEach((filter) => {
      if (filter.onChange) {
        filter.onChange(filter.type === 'select' ? 'all' : '');
      }
    });
    onClearAll?.();
  };

  const primaryFilters = filters.filter((f) => f.primary !== false).slice(0, 2);
  const advancedFilters = filters.filter((f) => f.primary === false || filters.indexOf(f) >= 2);

  return (
    <div className="space-y-3">
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-62.5">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className={`pl-10 pr-10 ${
              darkMode
                ? 'bg-slate-800 border-slate-700 text-slate-100'
                : 'bg-white'
            }`}
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange?.('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {primaryFilters.map((filter) => (
          <Select
            key={filter.id}
            value={filter.value}
            onValueChange={filter.onChange}
          >
            <SelectTrigger
              className={`w-45 ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-100'
                  : 'bg-white'
              }`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        {showAdvancedFilters && advancedFilters.length > 0 && (
          <Popover open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`relative ${
                  darkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700'
                    : 'bg-white'
                }`}
              >
                <SlidersHorizontal size={16} className="mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge
                    variant="default"
                    className="ml-2 px-1.5 py-0 h-5 min-w-5 bg-amber-500 hover:bg-amber-500"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className={`w-80 ${
                darkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-100'
                  : 'bg-white'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Advanced Filters</h4>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAll}
                      className="h-8 text-xs"
                    >
                      Clear all
                    </Button>
                  )}
                </div>
                <Separator />

                <div className="space-y-4 max-h-100 overflow-y-auto pr-2">
                  {advancedFilters.map((filter) => (
                    <div key={filter.id} className="space-y-2">
                      <Label className="text-sm font-medium">
                        {filter.label}
                      </Label>
                      {filter.type === 'select' && (
                        <Select
                          value={filter.value}
                          onValueChange={filter.onChange}
                        >
                          <SelectTrigger
                            className={
                              darkMode
                                ? 'bg-slate-800 border-slate-700'
                                : 'bg-white'
                            }
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {filter.options?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {filter.type === 'input' && (
                        <Input
                          value={filter.value}
                          onChange={(e) => filter.onChange?.(e.target.value)}
                          placeholder={filter.placeholder}
                          className={
                            darkMode
                              ? 'bg-slate-800 border-slate-700 text-slate-100'
                              : 'bg-white'
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className={`${
              darkMode
                ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <X size={14} className="mr-1" />
            Clear
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchValue && (
            <Badge
              variant="secondary"
              className={`${
                darkMode ? 'bg-slate-800 text-slate-100' : 'bg-slate-100'
              }`}
            >
              Search: {searchValue}
              <button
                onClick={() => onSearchChange?.('')}
                className="ml-2 hover:text-red-500 transition-colors"
              >
                <X size={12} />
              </button>
            </Badge>
          )}
          {filters
            .filter((f) => f.value && f.value !== 'all' && f.value !== '')
            .map((filter) => (
              <Badge
                key={filter.id}
                variant="secondary"
                className={`${
                  darkMode ? 'bg-slate-800 text-slate-100' : 'bg-slate-100'
                }`}
              >
                {filter.label}:{' '}
                {filter.options?.find((o) => o.value === filter.value)?.label ||
                  filter.value}
                <button
                  onClick={() =>
                    filter.onChange?.(filter.type === 'select' ? 'all' : '')
                  }
                  className="ml-2 hover:text-red-500 transition-colors"
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
        </div>
      )}
    </div>
  );
};

export default GenericFilter;