import { Link2, Plus, X } from "lucide-react";
import { Button } from "../../components/button";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";

interface Link {
  id: string;
  title: string;
  url: string;
}

export function ImportantLinks() {
  const { tripId } = useParams();
  const [links, setLinks] = useState<Link[]>([]);
  const [newLink, setNewLink] = useState(false);

  async function CreateLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const title = data.get("title")?.toString();
    const url = data.get("url")?.toString();

    if (!title || !url) {
      return;
    }

    await api.post(`/trips/${tripId}/links`, {
      title,
      url,
    });

    window.document.location.reload();
  }

  function openNewLink() {
    return setNewLink(true);
  }

  function closeNewLink() {
    return setNewLink(false);
  }

  useEffect(() => {
    api
      .get(`/trips/${tripId}/links`)
      .then((response) => setLinks(response.data.links));
  }, [tripId]);

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Links importantes</h2>
      <div className="space-y-5">
        {links.map((link) => {
          return (
            <div
              key={link.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <span className="block font-medium text-zinc-100">
                  {link.title}
                </span>
                <a
                  href={link.url}
                  className="block text-xs text-zinc-400 truncate hover:text-zinc-200"
                >
                  {link.url}
                </a>
              </div>
              <Link2 className="text-zinc-400 size-5 shri-0" />
            </div>
          );
        })}
      </div>

      <Button onClick={openNewLink} variant="secondary" size="full">
        <Plus className="size-5" />
        Cadastrar novo link
      </Button>

      {newLink && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Cadastrar link</h2>
                <button type="button" onClick={closeNewLink}>
                  <X className="size-5 text-zinc-400" />
                </button>
              </div>
              {/* <p className="text-sm text-zinc-400">
                Todos convidados podem visualizar as atividades.
              </p> */}
            </div>

            <form onSubmit={CreateLink} className="space-y-3">
              <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
                {/* <Tag className="text-zinc-400 size-5" /> */}
                <input
                  name="title"
                  placeholder="Qual o título do link?"
                  className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="h-14 flex-1 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
                  {/* <Calendar className="text-zinc-400 size-5" /> */}
                  <Link2 className="text-zinc-400 size-5 shri-0" />
                  <input
                    type="url"
                    name="url"
                    placeholder="URL"
                    className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" size="full">
                Salvar link
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
