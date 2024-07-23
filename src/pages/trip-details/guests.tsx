import { CheckCircle2, CircleDashed, UserCog, UserRoundPlus, X } from "lucide-react";
import { Button } from "../../components/button";
import { useParams } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { api } from "../../lib/axios";

interface Participant {
  id: string;
  name: string | null;
  email: string;
  is_confirmed: boolean;
}

export function Guests() {
  const { tripId } = useParams();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [inviteParticipant, setInviteParticipant] = useState(false);

  async function InviteNewParticipant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const email = data.get("email")?.toString();

    if(!email) {
      return
    }

    const response = await api.get(`/trips/${tripId}/participants`);
    const participantsList = response.data.participants as Participant[];
    const emailAlreadyExists = participantsList.some(participant => participant.email === email);

    if (emailAlreadyExists) {
      return;
    }

    await api.post(`/trips/${tripId}/invites`, {
      email,
    });

    window.document.location.reload();
  }

  function openInviteNewParticipant() {
    return setInviteParticipant(true);
  }

  function closeInviteNewParticipant() {
    return setInviteParticipant(false);
  }

  useEffect(() => {
    api
      .get(`/trips/${tripId}/participants`)
      .then((response) => setParticipants(response.data.participants));
  }, [tripId]);

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Convidados</h2>
      <div className="space-y-5">
        {participants.map((participant, index) => {
          return (
            <div
              key={participant.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <span className="block font-medium text-zinc-100">
                  {participant.name ?? `Convidado ${index}`}
                </span>
                <span className="block text-sm text-zinc-400 truncate">
                  {participant.email}
                </span>
              </div>
              {participant.is_confirmed ? (
                <CheckCircle2 className="size-5 shrink-0 text-green-400" />
              ) : (
                <CircleDashed className="text-zinc-400 size-5 shri-0" />
              )}
            </div>
          );
        })}
      </div>

      <Button
        onClick={openInviteNewParticipant}
        variant="secondary"
        size="full"
      >
        <UserCog className="size-5" />
        Adicionar novo participante
      </Button>

      {inviteParticipant && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Convidar novo participante</h2>
                <button type="button" onClick={closeInviteNewParticipant}>
                  <X className="size-5 text-zinc-400" />
                </button>
              </div>
            </div>

            <form onSubmit={InviteNewParticipant} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-14 flex-1 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
                <UserRoundPlus className="size-5 text-zinc-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" size="full">
                Convidar participante
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
