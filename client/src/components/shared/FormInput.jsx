import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

export const SelectInput = ({
  icon: Icon,
  placeholder,
  value,
  onValueChange,
  options,
}) => (
  <div className="relative group">
    <div className="relative ">
      <Icon
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors z-10 pointer-events-none"
        size={18}
      />
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full pl-11 pr-4 py-3.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-orange-500/30 rounded-xl focus:ring-4 focus:ring-orange-500/10 transition-all text-slate-700 font-medium text-sm md:text-base shadow-sm min-h-12">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);

export const DateInput = ({ icon: Icon, label, value, onChange }) => {
  const safeDate = value instanceof Date && !isNaN(value) ? value : new Date(); // fallback to today

  return (
    <div className="relative group">
      {label && (
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">
          {label}
        </Label>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full min-h-12 px-4 py-3.5 bg-slate-50 hover:bg-slate-100 focus:bg-white 
            border border-transparent focus:border-orange-500/30 rounded-xl 
            focus:ring-4 focus:ring-orange-500/10 transition-all 
            text-slate-700 font-medium text-sm md:text-base shadow-sm 
            flex items-center gap-3 justify-start"
          >
            <Icon
              className="text-slate-400 group-focus-within:text-orange-500 transition-colors"
              size={18}
            />
            <span className="leading-none">
              {safeDate.toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              })}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={safeDate}
            onSelect={(date) => {
              if (date) onChange(date);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const TimeInput = ({
  icon: Icon,
  label,
  value,
  onChange,
  timeSlots,
}) => {
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHour = h % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="group">
      {label && (
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">
          {label}
        </Label>
      )}

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className="
            w-full
            min-h-12
            px-4
            bg-slate-50 hover:bg-slate-100 focus:bg-white
            border border-transparent focus:border-orange-500/30
            rounded-xl
            focus:ring-4 focus:ring-orange-500/10
            transition-all
            shadow-sm
            flex items-center
          "
        >
          {/* Inner content wrapper */}
          <div className="flex items-center gap-3 text-slate-700 font-medium text-sm md:text-base leading-none">
            <Icon
              size={18}
              className="text-slate-400 group-focus-within:text-orange-500 transition-colors"
            />

            <SelectValue>{formatTime(value)}</SelectValue>
          </div>
        </SelectTrigger>

        <SelectContent className="max-h-60 rounded-xl shadow-lg border border-slate-200">
          {timeSlots.map((time) => (
            <SelectItem
              key={time}
              value={time}
              className="h-10 flex items-center text-sm"
            >
              {formatTime(time)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
