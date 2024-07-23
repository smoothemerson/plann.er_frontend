import { MapPin, Calendar, Settings2, X, ArrowRight } from "lucide-react";
import { Button } from "../../components/button";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { FormEvent, useEffect, useState } from "react";
import { format } from "date-fns";
import { DateRange, DayPicker } from "react-day-picker";

interface Trip {
  id: string;
  destination: string;
  starts_at: string;
  ends_at: string;
  is_confirmed: boolean;
}

export function DestinationAndDateHeader() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState<Trip | undefined>();
  const [isUpdateDate, setIsUpdateDate] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [destination, setDestination] = useState<string>("");
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<
    DateRange | undefined
  >(undefined);

  async function UpdateDateAndLocal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !destination ||
      !eventStartAndEndDates?.from ||
      !eventStartAndEndDates.to
    ) {
      return;
    }

    const starts_at = eventStartAndEndDates.from.toISOString();
    const ends_at = eventStartAndEndDates.to.toISOString();

    await api.put(`/trips/${tripId}`, {
      destination,
      starts_at,
      ends_at,
    });

    window.document.location.reload();
  }

  function openUpdateDate() {
    setIsUpdateDate(true);
  }

  function closeUpdateDate() {
    setIsUpdateDate(false);
  }

  function openDatePicker() {
    return setIsDatePickerOpen(true);
  }

  function closeDatePicker() {
    return setIsDatePickerOpen(false);
  }

  useEffect(() => {
    api.get(`/trips/${tripId}`).then((response) => {
      setTrip(response.data.trip);
      setDestination(response.data.trip.destination);
      setEventStartAndEndDates({
        from: new Date(response.data.trip.starts_at),
        to: new Date(response.data.trip.ends_at),
      });
    });
  }, [tripId]);

  const displayedDate =
    eventStartAndEndDates &&
    eventStartAndEndDates.from &&
    eventStartAndEndDates.to
      ? format(eventStartAndEndDates.from, "d' de 'LLL")
          .concat(" até ")
          .concat(format(eventStartAndEndDates.to, "d' de 'LLL"))
      : null;

  return (
    <div className="px-4 h-16 rounded-xl bg-zinc-900 shadow-shape flex items-center justify-between">
      <div className="flex items-center gap-2">
        <MapPin className="size-5 text-zinc-400" />
        <span className="text-zinc-100">{trip?.destination}</span>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <Calendar className="size-5 text-zinc-400" />
          <span className="text-zinc-100">{displayedDate}</span>
        </div>

        <div className="w-px h-6" />

        <Button onClick={openUpdateDate} variant="secondary">
          Alterar local/data
          <Settings2 className="size-5" />
        </Button>
      </div>

      {isUpdateDate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <form
            onSubmit={UpdateDateAndLocal}
            className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <MapPin className="size-5 text-zinc-400" />
                <input
                  type="text"
                  name="destination"
                  placeholder="Para onde você vai?"
                  className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                />
              </div>
              <button type="button" onClick={closeUpdateDate}>
                <X className="size-5 text-zinc-400" />
              </button>
            </div>

            <button
              type="button"
              onClick={openDatePicker}
              className="flex items-center gap-2 text-left w-[240px]"
            >
              <Calendar className="size-5 text-zinc-400" />
              <span className="text-lg text-zinc-400 w-40 flex-1">
                {displayedDate || "Quando?"}
              </span>
            </button>

            <Button type="submit" variant="primary" size="full">
              Atualizar
              <ArrowRight className="size-5" />
            </Button>
          </form>
        </div>
      )}

      {isDatePickerOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Selecione a data</h2>
                <button type="button" onClick={closeDatePicker}>
                  <X className="size-5 text-zinc-400" />
                </button>
              </div>
            </div>

            <DayPicker
              classNames={{
                chevron: `hover:bg-lime-800 bg-lime-300 border-lime-300 text-lime-950`,
                today: `text-lime-300`,
                range_start: `bg-lime-300 border-lime-300 text-lime-950 rounded-l-full`,
                range_end: `bg-lime-300 border-lime-300 text-lime-950 rounded-r-full`,
                selected: `bg-lime-300 border-lime-300 text-lime-950`,
                day: `hover:bg-lime-300 hover:text-lime-950`,
              }}
              mode="range"
              selected={eventStartAndEndDates}
              onSelect={setEventStartAndEndDates}
            />
          </div>
        </div>
      )}
    </div>
  );
}
