# Growvia Implementation & Architecture Documentation

## Executive Overview
Growvia is a modern, student- and early-career-centric career navigation platform. The platform adheres to a strict fairness standard:
- **Zero Candidate Fees**: Candidates are never charged to browse, apply, or export ATS-ready resumes.
- **Genuine Listings Only**: Zero fabricated listings, mock companies, fake testimonials, or artificial statistics. Unfilled categories render transparent, honest empty states.
- **Zero AI-Generated Visual Imagery**: All branding is driven by structured SVGs, clean typography, and a tailored navy-and-teal visual palette.

---

## Technical Stack & Architecture

- **Application Framework**: [TanStack Start](https://tanstack.com/start) (Full-stack SSR with React 19)
- **Bundler & Server**: Vite 8 & Nitro (targeting Cloudflare edge runtime)
- **Styling**: Tailwind CSS v4 with custom design tokens:
  - Primary Navy: `#142B4A` (`--navy`)
  - Accent Teal: `#16A085` (`--teal`)
  - Soft Blue: `#EBF3FA` (`--blue-soft`)
  - Surface: `#FFFFFF` / Neutral cards
- **Icons & UI Primitives**: Lucide Icons & Radix UI primitives
- **Database & Authentication**: Supabase with Row Level Security (RLS) policies:
  - `profiles`: Candidate background, skills, education, availability, online links, freelancer intro, notification settings.
  - `applications`: Application status pipeline tracking (`submitted`, `reviewing`, `interview`, `accepted`, `rejected`).
  - `saved_opportunities`: Bookmarked internships, jobs, and freelance gigs.
  - `resumes`: Single-user JSON resume storage with auto-sync and local draft fallback.
  - `contact_messages`: Inquiries and verification submissions from candidates and employers.

---

## Feature Specifications

### 1. Opportunity Discovery & Explorer
- Dedicated sections for **Internships** (`/internships`), **Jobs** (`/jobs`), and **Freelance Projects** (`/freelancing`).
- Multi-facet filtering by arrangement (`remote`, `hybrid`, `onsite`), schedule (`full-time`, `part-time`), duration, stipend/budget, and 10 industry categories.
- Real-time search with query debouncing and URL sync.
- Honest empty states when no verified listings are available.

### 2. Candidate Dashboard (`/dashboard`)
- Real-time metrics overview:
  - Saved opportunities count with shortcut to `/saved`.
  - Active application count with shortcut to `/applications`.
  - ATS resume completion percentage and active layout tracker.
  - Candidate profile readiness score calculated via `profileCompletion()`.
- Pipeline activity feed and recently bookmarked opportunities.

### 3. Candidate Profile (`/profile`)
- Personal background: Full name, headline, location, multiline bio.
- Education & availability selector (*Available immediately*, *2-4 weeks*, *Summer 2027*, *Part-time*, *Not looking*).
- Interactive tag input for technical/functional skills and career interests.
- Verified links for personal portfolio, GitHub, and LinkedIn profiles.
- Specialized freelancer intro pitch for client discovery and proposals.

### 4. Account Settings & Authentication (`/settings`, `/auth`)
- User identity display (name, email, account creation date, unique ID).
- In-app password update (`updateUser`) and on-demand reset email dispatch (`resetPasswordForEmail`).
- Email notification preferences toggle persisted to `profiles.email_updates`.
- Safe session termination and redirection via `signOut`.

### 5. ATS Resume Builder (`/resume-builder`, `/resume-builder/build`)
- Guided 8-step builder: Personal, Summary, Education, Experience, Projects, Skills, Certifications, Additional details.
- Three export templates:
  - **Classic**: Centered header, clean dividers, universal readability.
  - **Modern**: Navy headline rule and left-aligned structured layout.
  - **Compact**: Tighter vertical spacing designed for dense single-page formats.
- Real-time preview canvas with zoom scaling (`ScaledPreview`).
- Bidirectional section reordering (`moveSection`).
- Text-based PDF export (`@react-pdf/renderer`) with automatic multi-page numbering (`pageNumber / totalPages`).
- Automatic autosave to Supabase `resumes` table with seamless offline `localStorage` fallback.

### 6. Career Roadmaps & Learning Resources (`/roadmaps`, `/resources`, `/interview-prep`)
- Phased career roadmaps with realistic timelines and milestone deliverables for Software Engineering, Data & Analytics, Product Management, Design, and Marketing.
- Curated university-grade and open-source learning materials.
- Comprehensive interview question bank categorized by technical and behavioral domains.

### 7. Public & Legal Transparency (`/about`, `/contact`, `/privacy`, `/terms`)
- About page detailing Growvia's mission to bridge candidates from potential to opportunity.
- Interactive contact form with live insertion into Supabase `contact_messages`.
- Clear, readable Privacy Policy and Terms of Service outlining no-fee policies and data privacy guarantees.

---

## Quality Assurance & Verification

- **Linting (`npm run lint`)**: Passed with 0 errors.
- **Type Checking (`npx tsc --noEmit`)**: Passed with 0 errors.
- **Unit Testing (`npx vitest run`)**: 15 passed across 3 test suites (`resume-builder.test.ts`, `account.test.ts`, `app-routing.test.tsx`).
- **Production Build (`npm run build`)**: Client and Nitro SSR bundles generated cleanly in under 2 seconds.
