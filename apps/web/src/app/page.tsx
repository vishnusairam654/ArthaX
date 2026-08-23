import { PORTAL_IDS } from "@arthax/types";

export default function Home() {
  return (
    <main>
      <h1>ARTHA-X</h1>
      <p>Monorepo foundation online. Portals arriving in Phase 4+.</p>
      <ul>
        {PORTAL_IDS.map((id) => (
          <li key={id}>{id}</li>
        ))}
      </ul>
    </main>
  );
}
