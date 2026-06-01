# STARS — Documentation

**STARS** (Smart Tracking & Attendance Resource System) is the Mangosuthu University of Technology attendance experience: a production-style mobile app for students and lecturers, with a mock data layer today and a clean path to Supabase tomorrow.

Browsable version: [stars-supabase.html](../stars-supabase.html)

## What we are trying to achieve (plain language)

STARS makes **class attendance at MUT trustworthy and simple**:

1. **Fair attendance** — students prove presence; reduces proxy signing.
2. **Less admin for lecturers** — sessions and registers on phone, not paper.
3. **Clear visibility for leadership** — scoped reports for deans, HODs, admin.
4. **One app, many roles** — each person sees only what their job requires.

**Success:** lecturer starts class → students check in on phone → record saved → leaders see trusted summaries.

**Now:** app experience is largely built; team is connecting secure live data (demos may still use sample data).

Full non-technical section: [stars-supabase.html#plain-language](../stars-supabase.html#plain-language)

## Tech stack

| Layer | Technology |
|--------|--------------|
| **Runtime** | Node.js **20.19+** recommended (Expo SDK 54 minimum) |
| **Framework** | [Expo](https://expo.dev/) SDK **54** (managed workflow, EAS-ready) |
| **Language** | **TypeScript** (strict) |
| **Routing** | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based, deep links, web + native) |
| **UI** | React Native, **NativeWind v4** + **Tailwind** tokens, custom theme (`#E8E8E8`, `#006281`, `#4F1A1D`) |
| **Motion** | **react-native-reanimated** |
| **Forms** | **react-hook-form** + **Zod** (where used) |
| **State** | **Zustand** (auth, toasts, mock DB version bump, session selection) |
| **Persistence (native)** | **expo-secure-store** |
| **Persistence (web dev)** | `localStorage` via `authStorage` helper |
| **Location** | **expo-location** (one-shot capture for attendance simulation) |
| **Crypto** | **expo-crypto** (session seed for mock sessions) |
| **Data (current)** | In-memory **mock DB** (`src/mockDB/`) + JSON seeds |
| **Data (future)** | **Supabase** (**Auth**, **Postgres**, **Storage**) — interfaces and services structured to swap |
| **Offline-first (new)** | **PouchDB** local store + mutation outbox + background sync (`src/services/offline/`) |

## Milestones

| ID | Name | Goal |
|----|------|------|
| **M0** | Integration | Supabase + `dataSource` + service wiring; remove mock/dummy when live |
| **M1** | Authentication | Email/password Auth; session observable |
| **M2** | Profiles & roles | `user_profiles` → STARS role + institutional links |
| **M3** | Read paths | Dashboards/lists/analytics from Postgres |
| **M4** | Write paths | Sessions, challenge, enrolment, registers + RLS |
| **M5** | Cutover & hardening | `mock` \| `supabase` flag, observability, parity |
| **M6** | Challenge backend | Edge verification, uniqueness |

See [stars-supabase.html](../stars-supabase.html#milestones) for full descriptions.

## Story submissions

Integration team: [stars-submit.html](../stars-submit.html)
