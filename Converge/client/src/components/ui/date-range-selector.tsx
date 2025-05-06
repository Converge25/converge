import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DateRangeSelectorProps {
  onRangeChange: (range: string) => void;
  defaultValue?: string;
}

export default function DateRangeSelector({ onRangeChange, defaultValue = "7days" }: DateRangeSelectorProps) {
  const [selectedRange, setSelectedRange] = useState(defaultValue);

  const handleChange = (value: string) => {
    setSelectedRange(value);
    onRangeChange(value);
  };

  return (
    <div className="relative">
      <Select value={selectedRange} onValueChange={handleChange}>
        <SelectTrigger className="w-[140px] bg-white border-neutral-lighter">
          <SelectValue placeholder="Select date range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7days">Last 7 days</SelectItem>
          <SelectItem value="30days">Last 30 days</SelectItem>
          <SelectItem value="90days">Last 90 days</SelectItem>
          <SelectItem value="ytd">Year to date</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
