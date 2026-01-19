import { useState, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

interface VehicleRentalPickerProps {
  onDateChange?: (startDate: Date | null, endDate: Date | null) => void;
}

export function VehicleRentalPicker({ onDateChange }: VehicleRentalPickerProps) {
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(new Date());
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date());
  const [timeFrom, setTimeFrom] = useState<string>("10:30:00");
  const [timeTo, setTimeTo] = useState<string>("12:30:00");
  const [timeError, setTimeError] = useState<string | null>(null);

  useEffect(() => {
    if (onDateChange) {
      onDateChange(dateFrom || null, dateTo || null);
    }
  }, [dateFrom, dateTo, onDateChange]);

  function validateTimes(
    from: Date | undefined,
    to: Date | undefined,
    timeFrom: string,
    timeTo: string,
  ) {
    if (!from || !to) {
      setTimeError("");
      return true;
    }

    // Check if same day
    const isSameDay = from.toDateString() === to.toDateString();

    if (isSameDay && timeFrom < timeTo) {
      setTimeError("End time must be after start time on the same day");
      return false;
    }

    setTimeError("");
    return true;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-3">
          <Label htmlFor="date-from" className="px-1">
            For
          </Label>
          <Popover open={openFrom} onOpenChange={setOpenFrom}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-from"
                className="w-full justify-between font-normal"
              >
                {dateFrom
                  ? dateFrom.toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={dateFrom}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setDateFrom(date);
                  if (dateTo && date && date > dateTo) {
                    setDateTo(date);
                  }
                  setOpenFrom(false);
                }}
                disabled={{ before: new Date() }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="time-from" className="invisible px-1">
            From
          </Label>
          <Input
            type="time"
            id="time-from"
            step="1"
            value={timeFrom}
            onChange={(e) => {
              setTimeFrom(e.target.value);
              validateTimes(dateFrom, dateTo, e.target.value, timeTo);
            }}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-3">
          <Label htmlFor="date-to" className="px-1">
            To
          </Label>
          <Popover open={openTo} onOpenChange={setOpenTo}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-to"
                className="w-full justify-between font-normal"
              >
                {dateTo
                  ? dateTo.toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={dateTo}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setDateTo(date);
                  setOpenTo(false);
                }}
                disabled={dateFrom && { before: dateFrom }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="time-to" className="invisible px-1">
            To
          </Label>
          <Input
            type="time"
            id="time-to"
            step="1"
            value={timeTo}
            onChange={(e) => {
              setTimeTo(e.target.value);
              validateTimes(dateFrom, dateTo, timeFrom, e.target.value);
            }}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
      </div>
      {timeError && <p className="text-sm text-red-500">{timeError}</p>}
    </div>
  );
}
