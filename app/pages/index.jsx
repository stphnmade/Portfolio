import fs from "fs/promises";
import path from "path";

export async function getServerSideProps() {
  const jsonPath =
    process.env.RESUME_JSON_PATH || path.join(process.cwd(), "resume.json");
  let resume = null;
  try {
    const raw = await fs.readFile(jsonPath, "utf8");
    resume = JSON.parse(raw);
  } catch (e) {
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

  const { email, github, linkedin, phone } = contact;

  return (
    <main
      style={{
        fontFamily: "ui-sans-serif, system-ui, -apple-system",
        padding: "2rem",
        maxWidth: 960,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "2rem" }}>{name}</h1>
          <p style={{ margin: "0.25rem 0", opacity: 0.8 }}>
            Portfolio generated from resume.json
          </p>
        </div>
        <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {email && <a href={`mailto:${email}`}>Email</a>}
          {github && (
            <a href={github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
          {phone && <span style={{ opacity: 0.8 }}>{phone}</span>}
        </nav>
      </header>

      {/* Education */}
      {education?.length ? (
        <>
          <h2>Education</h2>
          <ul style={{ paddingLeft: 18 }}>
            {education.map((ed, i) => (
              <li key={i} style={{ marginBottom: 12 }}>
                <strong>{ed.institution}</strong>, {ed.location}
                <br />
                {ed.degree}
                {ed.concentration?.length ? (
                  <> — Concentration: {ed.concentration.join(", ")}</>
                ) : null}
                {ed.graduation_date ? (
                  <>
                    {" "}
                    — <em>{ed.graduation_date}</em>
                  </>
                ) : null}
                {ed.coursework?.length ? (
                  <div style={{ marginTop: 6 }}>
                    <span style={{ fontWeight: 600 }}>Coursework:</span>{" "}
                    <span>{ed.coursework.join(", ")}</span>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {/* Experience */}
      {experience?.length ? (
        <>
          <h2>Experience</h2>
          <ul style={{ paddingLeft: 18 }}>
            {experience.map((e, i) => (
              <li key={i} style={{ marginBottom: 16 }}>
                <div>
                  <strong>{e.title}</strong> @ {e.company} — {e.location}
                </div>
                <div style={{ opacity: 0.8, marginBottom: 6 }}>{e.dates}</div>
                {e.achievements?.length ? (
                  <ul>
                    {e.achievements.map((a, j) => (
                      <li key={j}>{a}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {/* Projects */}
      {projects?.length ? (
        <>
          <h2>Projects</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {projects.map((p, i) => (
              <article
                key={i}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <h3 style={{ marginTop: 0 }}>{p.name}</h3>
                <div style={{ opacity: 0.8, marginBottom: 6 }}>{p.dates}</div>
                {p.tech?.length ? (
                  <p style={{ fontSize: 14, opacity: 0.9, marginTop: 0 }}>
                    Tech: {p.tech.join(", ")}
                  </p>
                ) : null}
                {p.achievements?.length ? (
                  <ul style={{ marginTop: 8 }}>
                    {p.achievements.map((a, j) => (
                      <li key={j}>{a}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </>
      ) : null}

      {/* Skills (now grouped) */}
      {skills &&
      (skills.programming_languages?.length ||
        skills.databases?.length ||
        skills.web_software?.length ||
        skills.tools_platforms?.length) ? (
        <>
          <h2>Skills</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {skills.programming_languages?.length ? (
              <SkillGroup
                title="Programming Languages"
                items={skills.programming_languages}
              />
            ) : null}
            {skills.databases?.length ? (
              <SkillGroup title="Databases" items={skills.databases} />
            ) : null}
            {skills.web_software?.length ? (
              <SkillGroup title="Web & Software" items={skills.web_software} />
            ) : null}
            {skills.tools_platforms?.length ? (
              <SkillGroup
                title="Tools & Platforms"
                items={skills.tools_platforms}
              />
            ) : null}
          </div>
        </>
      ) : null}

      <footer style={{ marginTop: 40, opacity: 0.6 }}>
        Built from <code>resume.json</code>. <a href="/api/resume">View JSON</a>
      </footer>
    </main>
  );
}

function SkillGroup({ title, items }) {
  return (
    <section
      style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}
    >
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          padding: 0,
          listStyle: "none",
          margin: 0,
        }}
      >
        {items.map((s, i) => (
          <li
            key={i}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: "6px 10px",
            }}
          >
            {s}
          </li>
        ))}
      </ul>
    </section>
  );
}
