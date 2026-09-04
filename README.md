# Royal Luxury Wedding & Homecoming Invitation Platform

An expert-level, creative digital wedding invitation web application with a luxury royal aesthetic, interactive wax seal envelope animations, live guest RSVP management, dynamic VIP table check-in QR codes, navigation hub, and an executive administration suite.

---

## Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin`
- **Admin Portal**: `/admin/login`

---

## Key Features

### 1. Creative Guest Invitation Experience (`/invite/[token]`)
- **3D Wax Seal Envelope Reveal**: Interactive 3D envelope with a royal monogram seal (`S & S`) and celebratory golden sparkle particle burst upon opening.
- **Luxury Royal Typography & Parchment Design**: Styled with Google Fonts (`Cinzel`, `Playfair Display`, `Alex Brush`, and `Plus Jakarta Sans`) and gold foil shaders.
- **VIP Guest Pass & Check-in QR Code**: Personalized guest salutation, invite category (Single, Couple, Family), table number, and dynamic check-in QR code.
- **Celebration Itinerary / Programme**: Visual milestone timeline of the wedding events.
- **Live Countdown Clock**: Champagne gold glassmorphic countdown clock.
- **Smart Navigation Hub**: Leaflet interactive venue map with 1-click directions to **Google Maps**, **Apple Maps**, and **Waze**, plus copy address with toast feedback.
- **Calendar Reminders**: 1-Click **Google Calendar** web link and **Apple / Outlook iCal** download.
- **Interactive RSVP & Guest Wishes**: Real-time RSVP confirmation with attendance count and heartfelt blessing notes.
- **Floating Vinyl Disc Music Player**: Rotating record with audio equalizer visualizer and volume controls.
- **Social Sharing**: 1-Click WhatsApp direct invitation sharing and copy link.

### 2. Executive Admin Portal (`/admin/dashboard`)
- **Executive Analytics Bar**: Real-time metrics for total invited guests, estimated headcount, table counts, and invitation open rates.
- **Guest Seating & Directory Manager**: Live search, category filtering (Single/Couple/Family), viewed status filter, and multiple sort options.
- **1-Click WhatsApp Direct Invite**: Generates pre-formatted personalized wedding invitation messages with recipient links.
- **VIP QR Code Modal**: Preview and share individual QR passes.
- **Catering & Seating CSV Export**: 1-Click export to `.csv` for banquet planners and venue coordinators.
- **Ceremony & Event Settings Editor**: Live editor for couple names, event dates, venue coordinates, and wording.
- **Printable Place Cards**: Print-ready luxury table cards for reception place settings.

---

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Generate Database Client**:
   ```bash
   npx prisma generate
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   npm run start
   ```

