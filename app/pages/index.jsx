import fs from "fs/promises";
import path from "path";
import { useMemo, useState } from "react";
import ProjectCard from "@/components/ProjectCard";

export async function getServerSideProps() {
  const jsonPath =
    process.env.RESUME_JSON_PATH || path.join(process.cwd(), "resume.json");
  let resume;
  try {
    resume = JSON.parse(await fs.readFile(jsonPath, "utf8"));
  } catch {
    resume = { name: "Missing resume.json" };
  }
  return { props: { resume } };
}

export default function Home({ resume }) {
  const {
    name = "",
    contact = {},
    education = [],
    experience = [],
    projects = [],
    skills = {},
  } = resume;
  const [query, setQuery] = useState("");
  const allTags = useMemo(
    () => [...new Set(projects.flatMap((p) => p.tags || []))],
    [projects]
  );
  const [tag, setTag] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return projects.filter((p) => {
      const qHit =
        !q ||
        [p.name, ...(p.tech || []), ...(p.achievements || [])]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const tHit = !tag || (p.tags || []).includes(tag);
      return qHit && tHit;
    });
  }, [projects, query, tag]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      {/* Header */}
      <header className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{name}</h1>
          <p className="opacity-70">
            Portfolio generated from <code>resume.json</code>
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm">
          {contact.email && (
            <a className="underline" href={`mailto:${contact.email}`}>
              Email
            </a>
          )}
          {contact.github && (
            <a
              className="underline"
              href={contact.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          )}
          {contact.linkedin && (
            <a
              className="underline"
              href={contact.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          )}
          {contact.phone && <span className="opacity-70">{contact.phone}</span>}
        </nav>
      </header>

      {/* Controls */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects by name, tech, or achievement…"
          className="w-full sm:w-2/3 rounded-xl border px-4 py-2"
        />
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="rounded-xl border px-3 py-2"
        >
          <option value="">All tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Projects */}
      {filtered.length ? (
        <>
          <h2 className="mb-4 text-xl font-semibold">Projects</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <ProjectCard key={i} p={p} />
            ))}
          </div>
        </>
      ) : (
        <p className="opacity-70">No projects match your filters.</p>
      )}

      {/* Experience */}
      {!!experience.length && (
        <section className="mt-12">
          <h2 className="mb-3 text-xl font-semibold">Experience</h2>
          <ul className="space-y-4">
            {experience.map((e, i) => (
              <li key={i} className="rounded-2xl border p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <strong>{e.title}</strong> @ {e.company} — {e.location}
                  </div>
                  <div className="text-sm opacity-60">{e.dates}</div>
                </div>
                {e.achievements?.length && (
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    {e.achievements.map((a, j) => (
                      <li key={j}>{a}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Education */}
      {!!education.length && (
        <section className="mt-12">
          <h2 className="mb-3 text-xl font-semibold">Education</h2>
          <ul className="space-y-3">
            {education.map((ed, i) => (
              <li key={i} className="rounded-2xl border p-5">
                <div className="font-semibold">
                  {ed.institution}, {ed.location}
                </div>
                <div>{ed.degree}</div>
                <div className="opacity-70">
                  {ed.concentration?.length ? (
                    <>Concentration: {ed.concentration.join(", ")} · </>
                  ) : null}
                  {ed.graduation_date}
                </div>
                {ed.coursework?.length ? (
                  <div className="mt-2 text-sm opacity-80">
                    Coursework: {ed.coursework.join(", ")}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Skills */}
      {skills && (
        <section className="mt-12">
          <h2 className="mb-3 text-xl font-semibold">Skills</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SkillGroup
              title="Programming Languages"
              items={skills.programming_languages}
            />
            <SkillGroup title="Databases" items={skills.databases} />
            <SkillGroup title="Web & Software" items={skills.web_software} />
            <SkillGroup
              title="Tools & Platforms"
              items={skills.tools_platforms}
            />
          </div>
        </section>
      )}

      <footer className="mt-12 text-sm opacity-60">
        Built with Next.js + Tailwind · Data source:{" "}
        <a className="underline" href="/api/resume">
          /api/resume
        </a>
      </footer>
    </main>
  );
}

function SkillGroup({ title, items }) {
  if (!items?.length) return null;
  return (
    <div className="rounded-2xl border p-5">
      <h3 className="mb-2 font-semibold">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((s, i) => (
          <span key={i} className="rounded-lg border px-2 py-1 text-xs">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
