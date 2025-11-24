# Kendara Go

[Kendara Go]() is a web-based application designed to facilitate vehicle rentals, with a primary focus on motorcycles. The app addresses key user pains such as inaccurate location and contact information, difficulty in comparing and selecting options, unclear availability, and lack of transparent rental details. It aims to provide a seamless experience for users to find, filter, and view rental options quickly, minimizing the need for direct contact with providers.

Table of Contents:

- [Kendara Go](#kendara-go)
  - [Links](#links)
  - [Architecture](#architecture)
    - [Presentation Layer (UI)](#presentation-layer-ui)
    - [Application Layer (Business Logic)](#application-layer-business-logic)
    - [Data Access Layer (Database)](#data-access-layer-database)
  - [Flowchart](#flowchart)
  - [Features](#features)
    - [1. Pencarian Berdasarkan Lokasi](#1-pencarian-berdasarkan-lokasi)
    - [2. Filter \& Sorting Kendaraan](#2-filter--sorting-kendaraan)
    - [3. Detail Kendaraan \& Rental](#3-detail-kendaraan--rental)
  - [UI Designs](#ui-designs)
    - [Home Page](#home-page)
  - [Entity Relationship Diagram (ERD)](#entity-relationship-diagram-erd)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Development](#development)
  - [Building for Production](#building-for-production)
  - [Deployment](#deployment)
    - [Docker Deployment](#docker-deployment)
    - [DIY Deployment](#diy-deployment)
  - [Styling](#styling)

## Links

- Website/Frontend: 
  - Backend:
- Repositories:
  - Backend: <https://github.com/kendarago/kendarago-api>
  - Frontend: <https://github.com/kendarago/kendarago>

Inspirations:
- <https://www.turo.com>
- <https://www.traveloka.com/id-id/car-rental>
- <https://www.kayak.co.id/>

## Architecture

### Presentation Layer (UI)

- HTML
- CSS
  - Tailwind CSS
  - Shadcn/ui
- Javascript
- Typescript
- React
- React Router
- Docker

### Application Layer (Business Logic)

- Javascript
- Typescript
- Hono
- OpenAPI
- Zod
- Docker

### Data Access Layer (Database)

- Prisma
- PostgreSQL
- Docker

## Flowchart

```mermaid
flowchart TD
    A[Start: Open App] --> B[Detect User Location via GPS or Manual Input]
    B --> C[Search for Nearby Rentals]
    C --> D[Display List of Rentals with Distance, Address, Contact, Hours]
    D --> E[Apply Filters: Vehicle Type/Make, Price Range, Availability]
    E --> F[Sort List by Price Ascending/Descending]
    F --> G[View Filtered/Sorted List]
    G --> H{Select a Rental/Vehicle?}
    H -->|Yes| I[Display Details: Real-time Status, Type/Make, Prices, Additional Fees, Terms, Required Docs]
    I --> J[User Decides: Contact Rental or Back]
    H -->|No| K[End Session]
    J --> K[End Session]
```

## Features

### 1. Pencarian Berdasarkan Lokasi
- Deteksi lokasi otomatis via GPS atau input manual (kota/kecamatan)
- Integrasi peta (Google Maps / Leaflet) menampilkan rental terdekat
- List rental menampilkan:
  - Jarak (km)
  - Alamat lengkap
  - Nomor telepon / WhatsApp
  - Jam operasional
- Fallback: pencarian berbasis teks jika GPS dimatikan

### 2. Filter & Sorting Kendaraan
- Filter:
  - Jenis kendaraan (fokus Motor: Matic, Bebek, Sport, dll)
  - Merk (Honda, Yamaha, dll)
  - Range harga per hari (slider atau input manual)
  - Status ketersediaan (Available / Maintenance)
- Sorting:
  - Harga termurah → termahal
  - Harga termahal → termurah
  - Jarak terdekat
- Filter & sorting real-time (tanpa reload halaman)

### 3. Detail Kendaraan & Rental
- Halaman detail per rental / per motor dengan:
  - Foto kendaraan (multiple)
  - Status real-time: Available / Booked / Maintenance
  - Jenis & merk motor
  - Harga dasar (mulai dari ... /hari)
  - Biaya tambahan:
    - Overtime per jam
    - Delivery / Pick-up (jika ada)
  - Syarat & ketentuan sewa
  - Dokumen wajib (KTP, SIM C, dll)
  - Tombol langsung hubungi (Telpon / WhatsApp)
- Update status otomatis via polling atau WebSocket (opsional di MVP)

## UI Designs

- Figma: <https://www.figma.com/design/g4WZixh4KQUw449yd3IddI/KendaraGo?node-id=22-3&t=ZIrMH33e78VcZfhV-1>

### Home Page

<img alt="Home Page" src="./designs/home.jpg" width="400" />

## Entity Relationship Diagram (ERD)

Detailed design: [https://dbdiagram.io/d/6924ddf7228c5bbc1a51f3ee](https://dbdiagram.io/d/6924ddf7228c5bbc1a51f3ee)

![ERD](./diagrams/erd.svg)# Kendarago

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
