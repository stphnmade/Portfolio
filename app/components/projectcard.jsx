import Badge from "./badge";

export default function ProjectCard({ p }) {
  return (
    <article className="rounded-2xl border p-5 hover:shadow-sm transition">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold">{p.name}</h3>
        {p.dates && <span className="text-xs opacity-60">{p.dates}</span>}
      </div>

      {p.tech?.length ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {p.tech.map((t, i) => (
            <Badge key={i}>{t}</Badge>
          ))}
        </div>
      ) : null}

      {p.achievements?.length ? (
        <ul className="mt-3 list-disc pl-5 space-y-1">
          {p.achievements.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      ) : null}

      {p.media?.length ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {p.media.slice(0, 2).map((src, i) => (
            <img key={i} src={src} alt="" className="rounded-lg border" />
          ))}
        </div>
      ) : null}

      {(p.repo || p.demo) && (
        <div className="mt-4 flex gap-4 text-sm">
          {p.demo && (
            <a
              className="underline"
              href={p.demo}
              target="_blank"
              rel="noreferrer"
            >
              Demo
            </a>
          )}
          {p.repo && (
            <a
              className="underline"
              href={p.repo}
              target="_blank"
              rel="noreferrer"
            >
              Code
            </a>
          )}
        </div>
      )}

      {p.embed_url && (
        <div className="mt-4">
          <iframe
            src={p.embed_url}
            className="w-full h-80 rounded-xl border"
            loading="lazy"
            allow="fullscreen; clipboard-read; clipboard-write"
          />
        </div>
      )}

      {p.tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {p.tags.map((t, i) => (
            <span key={i} className="text-xs opacity-50">
              #{t}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
