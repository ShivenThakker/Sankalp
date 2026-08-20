<div align="center">

# 🆘 ReliefNet

### AI-Powered National Disaster Relief Coordination & Verified NGO Network

**One platform. Every verified responder. When disaster strikes.**

[![Made for SIH 2026](https://img.shields.io/badge/Smart%20India%20Hackathon-2026-orange?style=for-the-badge)](#)
[![Status](https://img.shields.io/badge/status-prototype-yellow?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge)](#)

</div>

---

## 🌊 The Problem

When disaster hits, help exists — it's just **scattered**.

> One NGO has 500 food kits. Another has medical volunteers. Another has boats.
> Another is collecting donations. Another runs a shelter.
> **Nobody knows who can help right now — and nobody knows where to send resources.**

India already has pieces of the puzzle:
- 🛰️ **NDMA SACHET** — geo-targeted multi-hazard alerts
- 📋 **NGO DARPAN** — government NGO registration records

But nothing **connects** alerts → verified capacity → the people who need it, in real time.

**ReliefNet is the missing layer between "disaster happens" and "help arrives."**

---

## ⚡ What Makes This Different

| ❌ Not This | ✅ This |
|---|---|
| "We made a database of NGOs" | "We turn fragmented relief data into an intelligent response network" |
| Static NGO directory | Real-time, trust-scored, resource-aware coordination engine |
| Donate and hope | Donate and **track exactly where it goes** |
| Alerts that just inform | Alerts that **trigger matching and action** |

---

## 🧠 System Architecture

```
                    ┌──────────────┐
                    │ NDMA / SACHET│
                    └──────┬───────┘
                           │
                           ▼
                 ┌──────────────────┐
                 │  Disaster Engine  │
                 └────────┬─────────┘
                          │
                          ▼
┌──────────────┐   ┌──────────────────┐   ┌──────────────┐
│ NGO Database │──►│  Matching Engine  │◄──│ Need Reports │
└──────────────┘   └────────┬─────────┘   └──────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
          CITIZENS        NGOs         DONORS
              │             │             │
              └─────────────┼─────────────┘
                            ▼
                  ┌─────────────────┐
                  │  Relief Dashboard│
                  └─────────────────┘
```

---

## 🚀 Core Features

### 🆘 One-Tap "I Need Help" Mode
No jargon, no forms. A citizen taps **FOOD / MEDICAL / SHELTER / RESCUE / WATER / TRANSPORT** and gets auto-matched to the nearest verified responder.

### 🛡️ NGO Trust Score
Every organization is scored on real evidence — not self-reported claims.

| Parameter | Status |
|---|---|
| NGO DARPAN | ✅ Verified |
| PAN / 80G | ✅ Verified |
| Disaster response history | ✅ Verified |
| Last activity check | 2 months ago |
| Active districts | 7 |

```
🟢 VERIFIED ORGANIZATION — Trust Score: 91/100
```

### 🤖 AI Matching & Resource Allocation
Given a need report — location, disaster type, headcount, required resources — the engine ranks organizations by **capability + distance + availability + trust**, and generates an allocation recommendation.

### ⚠️ Live Disaster Layer
Consumes SACHET-style alerts and overlays them with real relief capacity:

```
⚠ FLOOD ALERT — District X — Severity: HIGH

Food      ██████████ 82%
Medical   ██████     51%
Shelter   ███        28%
Transport ██         17%

🚨 Critical shortage: Shelter, Transportation
```

### 💰 Transparent Donations
Every rupee traceable from donor → allocation → NGO → delivery confirmation.

```
FLOOD RELIEF — ASSAM
Target: ₹25,00,000   Collected: ₹17,40,000

Food ₹7.2L · Medicine ₹4.1L · Shelter ₹3.8L · Transport ₹2.3L
```

### 🧑‍🚒 Volunteer Matching
Skilled volunteers (drivers, medics, translators, drone operators) matched to live NGO needs during active disasters.

### 🕒 Data Freshness Engine
Solves the #1 failure mode of relief tech — **stale information**.

```
🟢 Active — verified recently
🟡 Information aging
🔴 Unable to verify
```

### 🔎 Fraud & Fake-NGO Detection
Flags duplicate registrations, suspicious donation accounts, inconsistent compliance data, and inactive orgs before they cause harm.

---

## 🗂️ Data Model

<details>
<summary><b>Click to expand schema</b></summary>

```
NGO
├── NGO_ID, Name, Registration_Number
├── NGO_DARPAN_ID, PAN, 80G_Status, FCRA_Status
├── Address, District, State, Contact, Website
└── Verification_Status, Trust_Score, Last_Verified

Capabilities
├── NGO_ID
└── Food | Water | Medical | Shelter | Rescue | Transportation
    Childcare | Animal Rescue | Psych Support | Financial Aid

Resources
├── NGO_ID
└── Food_Kits, Water_Litres, Medical_Kits, Beds,
    Vehicles, Boats, Volunteers, Doctors

Disaster
├── Disaster_ID, Type, Location, Severity
└── Start_Time, Affected_Population, Source

Relief_Request
├── Request_ID, User, Location, Disaster
└── Requirement, Quantity, Urgency, Status
```

</details>

---

## 🎬 Demo Flow (Hackathon Vertical Slice)

1. Flood hits District X → SACHET-style alert fires
2. Map highlights affected area
3. System surfaces 25 verified NGOs in range
4. AI ranks NGOs by capability + distance + trust
5. Citizens submit relief requests via 🆘 mode
6. Matching engine auto-assigns organizations
7. NGOs update live resource availability
8. Dashboard surfaces real-time shortages
9. Donors see verified orgs + exact current needs
10. Admin console shows the full disaster picture

---

## 🧩 Feasibility Snapshot

| Component | Confidence |
|---|---|
| NGO database & verification | ⭐⭐⭐⭐⭐ |
| Maps / location layer | ⭐⭐⭐⭐⭐ |
| Disaster alert ingestion | ⭐⭐⭐⭐ |
| AI matching engine | ⭐⭐⭐⭐ |
| Volunteer matching | ⭐⭐⭐⭐ |
| Donation tracking | ⭐⭐⭐ |
| National-scale deployment | ⭐⭐ *(post-hackathon)* |

---

## 🎯 Positioning

**We're not competing with SACHET — we're completing it.**

SACHET handles the *alert*. ReliefNet handles the *"what happens next"* — connecting affected people, verified NGOs, volunteers, and donors into a single coordinated response.

> ⚠️ ReliefNet's Trust Score is a platform-generated risk/verification indicator based on documented evidence — **it is not a government certification.**

---

## 🛠️ Tech Stack

> _Fill in once finalized — placeholder below_

| Layer | Tech |
|---|---|
| Frontend | — |
| Backend | — |
| Database | — |
| Maps/Geo | — |
| AI/Matching | — |
| Auth | — |

---

## 📦 Getting Started

```bash
git clone https://github.com/<your-username>/reliefnet.git
cd reliefnet
# setup instructions coming soon
```

---

<div align="center">

### Built for Smart India Hackathon 2026 🇮🇳

**When disaster strikes, seconds matter. ReliefNet makes sure help finds them.**

</div>
