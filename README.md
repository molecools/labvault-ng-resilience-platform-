# LabVault NG — Nigeria Lab Resilience Network

LabVault NG is a deploy-ready prototype for a shared Nigerian laboratory network. It helps research and diagnostics teams keep reagents in circulation, see cold-chain risk early, and coordinate a simulated emergency response when a freezer fails.

## Problem Statement

Laboratories can lose expensive, time-sensitive reagents because surplus stays isolated in one lab, expiry dates are hard to see across institutions, and freezer failures may not have a visible response path. The cost is duplicated procurement, avoidable waste, and interrupted research.

## Value Proposition

LabVault NG makes resilience operational: labs can discover nearby surplus, offer inventory back to the network, monitor simulated freezer telemetry, and automatically flag affected reagents for emergency swap when a temperature threshold is crossed.

## How to Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app has no required environment variables, backend server, external database, or paid API.

To make a production build:

```bash
npm run build
npm start
```

The project is structured for Vercel deployment using the standard Next.js build output.

## Features

- Responsive landing page with LabVault NG positioning, impact stats, and calls to action.
- Top navigation across Overview, Marketplace, My Inventory, Cold Chain, and Alert Log.
- Marketplace search plus University, State, Category, and Status filters.
- Reagent cards with quantity, expiry, owner lab, university, state, price, storage temperature, and status.
- Simulated Request Swap / Buy toasts.
- Add Surplus Reagent modal persisted to browser `localStorage`.
- FUTA demo inventory table with localStorage-backed add, edit, and delete controls.
- Three-freezer Cold Chain Monitor with live Chart.js line chart updates every three seconds.
- Simulated power failure action that forces a selected freezer to `0°C` and marks it `Critical`, including the 4°C cold room demo node.
- Simulated Dashboard, SMS, and WhatsApp alert log with timestamp and source freezer.
- Active WhatsApp handoff to `+2348091565868` with a prefilled critical-alert message when the power-failure action is used.
- Emergency marketplace banner showing the affected reagent count and university.
- Seed data in `/data/mockData.json` with 12 Nigerian labs and 25 reagents.

## Tech Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Chart.js and `react-chartjs-2`
- Browser `localStorage` for persistence
- Static JSON seed data; no external database

## Data Models

`Reagent` includes `id`, `name`, `category`, `quantity`, `unit`, `expiryDate`, `storageTemp`, `status`, `ownerLab`, `university`, `locationState`, `priceNGN`, and `isEmergencySwap`.

`Freezer` includes `id`, `name`, `labId`, `currentTemp`, `targetTemp`, `status`, and `reagentsInside`.

`Alert` includes `id`, `freezerId`, `timestamp`, `temp`, `message`, and `type` (`Dashboard`, `SMS`, or `WhatsApp`).

## Integration Logic

1. The provider initializes the browser state from `/data/mockData.json`. Once hydrated, reagent, freezer, and alert changes are persisted to `localStorage` under the `labvault-ng-state-v1` key.
2. The Cold Chain Monitor generates a new temperature reading every three seconds using `Math.random()` and writes it through the shared provider.
3. A `-20°C` freezer becomes `Warning` above `-18°C` and `Critical` above `-15°C`. The `-80°C` freezer uses a `-70°C` critical threshold. The `4°C` cold room becomes critical above `8°C` during normal telemetry.
4. The explicit **Simulate Power Failure** action forces the selected freezer to `0°C` and treats the event as `Critical` for every freezer type, including the 4°C cold room. This guarantees the demo response path is testable from every node.
5. When a freezer transitions into `Critical`, the provider finds every reagent ID in that freezer's `reagentsInside` array and changes its status to `AT RISK - EMERGENCY SWAP`, also setting `isEmergencySwap` to `true`.
6. The same event creates three simulated alerts: one Dashboard entry, one SMS entry, and one WhatsApp entry. The messages include the freezer reading, affected count, and university context.
7. The event stores `emergencyInfo` in localStorage. Marketplace reads that shared state and displays the rescue banner with the affected count and university.

All messaging and IoT behavior is intentionally simulated in the browser for the assignment prototype. The WhatsApp action opens a prefilled `wa.me` chat to `+2348091565868`; the user must confirm/send it in WhatsApp because this no-backend prototype cannot silently send real messages. Automatic temperature-triggered critical events also show the recipient in the active alert context, while browser popup policies prevent an automatic background WhatsApp window without a user gesture.
