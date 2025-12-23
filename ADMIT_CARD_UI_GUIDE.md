# Admit Card Feature - UI/UX Guide

## Page Layout Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        HEADER                                   │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│   SIDEBAR    │         ADMIT CARD MANAGEMENT PAGE              │
│              │                                                  │
│              │  ┌──────────────────────────────────────────┐  │
│              │  │     SELECT CRITERIA (Filter Section)    │  │
│              │  ├──────────────────────────────────────────┤  │
│              │  │ Exam Term: [Dropdown ▼]                 │  │
│              │  │ Exam Name: [Dropdown ▼]                 │  │
│              │  │ Search Student: [Text Input]            │  │
│              │  └──────────────────────────────────────────┘  │
│              │                                                  │
│              │  ┌──────────────────────────────────────────┐  │
│              │  │      STUDENT LIST (Table)               │  │
│              │  ├─────────┬──────┬────────┬──────┬────────┤  │
│              │  │ Student │ Adm# │ Roll # │Class │ Action │  │
│              │  ├─────────┼──────┼────────┼──────┼────────┤  │
│              │  │ John    │ 1001 │ 1      │10-A  │  👁 ✓ │  │
│              │  │ Jane    │ 1002 │ 2      │10-A  │  👁 ✓ │  │
│              │  │ ...     │ ...  │ ...    │...   │  ...  │  │
│              │  └──────────────────────────────────────────┘  │
│              │                                                  │
│              │  ┌──────────────────────────────────────────┐  │
│              │  │    PAGINATION: < 1 2 3 4 >              │  │
│              │  └──────────────────────────────────────────┘  │
│              │                                                  │
└──────────────┴──────────────────────────────────────────────────┘
```

## Responsive Breakdown

### Mobile View (< 640px)
```
┌──────────────────────────────┐
│     HEADER (Hamburger)       │
├──────────────────────────────┤
│  ◀ Admit Card Management     │
├──────────────────────────────┤
│  Select Criteria             │
├──────────────────────────────┤
│ Exam Term:                   │
│ [Select Exam Term ........▼] │
│                              │
│ Exam Name:                   │
│ [Select Exam .............▼] │
│ (disabled until term selected)
│                              │
│ Search Student:              │
│ [Search box ............]    │
├──────────────────────────────┤
│  STUDENTS (Single Column)    │
├──────────────────────────────┤
│ John (1-1)                   │
│ Roll: 1                       │
│ [👁] [Del]                    │
├──────────────────────────────┤
│ Jane (1002-2)                │
│ Roll: 2                       │
│ [👁] [Del]                    │
├──────────────────────────────┤
│ Page 1 of 5                  │
│ < 1 2 3 4 5 >                │
└──────────────────────────────┘
```

**Hidden on Mobile:**
- Admission # column
- Class column
- Detailed spacing

### Tablet View (640px - 1024px)
```
┌────────────────────────────────────────────┐
│        HEADER (Full Size)                  │
├─────────┬─────────────────────────────────┤
│ SIDEBAR │  Admit Card Management          │
├─────────┼─────────────────────────────────┤
│         │  Select Criteria                │
│         ├─────────────────────────────────┤
│         │ Exam Term: [Selection ▼]        │
│         │ Exam Name: [Selection ▼]        │
│         │ Search: [Search box]            │
│         │                                 │
│         ├─────────────────────────────────┤
│         │  STUDENTS TABLE (2-Column)     │
│         │ ┌─────────┬──────┬──────────┐  │
│         │ │ Student │ Roll │ Actions  │  │
│         │ ├─────────┼──────┼──────────┤  │
│         │ │ John    │ 1    │ 👁 Del   │  │
│         │ │ Jane    │ 2    │ 👁 Del   │  │
│         │ └─────────┴──────┴──────────┘  │
│         │ ... more rows ...               │
│         │                                 │
│         │ Pagination: < 1 2 3 4 >        │
│         │                                 │
└─────────┴─────────────────────────────────┘
```

**Visible on Tablet:**
- Admission # column appears
- Larger tap targets
- Better spacing

### Desktop View (> 1024px)
```
┌──────────────────────────────────────────────────────────────────┐
│                          FULL HEADER                             │
├──────────┬───────────────────────────────────────────────────────┤
│ SIDEBAR  │            Admit Card Management                      │
├──────────┼───────────────────────────────────────────────────────┤
│          │ SELECT CRITERIA                                       │
│          ├───────────────────────────────────────────────────────┤
│          │ Exam Term: [Selection ▼]  Exam Name: [Selection ▼]   │
│          │ Search: [Search box]                                  │
│          │                                                       │
│          ├───────────────────────────────────────────────────────┤
│          │  FULL STUDENTS TABLE (All Columns)                   │
│          │ ┌────────┬──────────┬─────┬──────┬────────────────┐ │
│          │ │ Student│ Admission│Roll │Class │ Actions        │ │
│          │ ├────────┼──────────┼─────┼──────┼────────────────┤ │
│          │ │ John D │ 1001     │ 1   │10-A  │ 👁 Edit Delete │ │
│          │ │ Jane S │ 1002     │ 2   │10-A  │ 👁 Edit Delete │ │
│          │ │ Mike P │ 1003     │ 3   │10-A  │ 👁 Edit Delete │ │
│          │ └────────┴──────────┴─────┴──────┴────────────────┘ │
│          │ ... more rows with full information ...              │
│          │                                                       │
│          │ Pagination: < [1][2][3][4][5] >                     │
│          │                                                       │
└──────────┴───────────────────────────────────────────────────────┘
```

**Visible on Desktop:**
- All columns displayed
- Class column visible
- Full text everywhere
- Hover effects on buttons

## Modal Popup - Admit Card View

### Desktop View
```
┌────────────────────────────────────────────────────────┐
│ Admit Card                               [X]           │
├────────────────────────────────────────────────────────┤
│ [Print] [Download]                                     │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │ GurukulSarthi School Management          [QR]│    │
│  │ Examination Admit Card 2025                 │    │
│  ├──────────────────────────────────────────────┤    │
│  │                                              │    │
│  │ Student Name: John Doe                       │    │
│  │ Roll Number: 1      Class: 10-A              │    │
│  │                                              │    │
│  │ ┌─── EXAMINATION DETAILS ────────────────┐  │    │
│  │ │ Date: 15-Mar-2025    Time: 09:00-12:00│  │    │
│  │ │ Venue: Main Hall, Block A              │  │    │
│  │ └────────────────────────────────────────┘  │    │
│  │                                              │    │
│  │ IMPORTANT INSTRUCTIONS                      │    │
│  │ • Arrive 30 minutes early                   │    │
│  │ • Bring school ID                           │    │
│  │ • No electronics allowed                    │    │
│  │                                              │    │
│  │ Principal: ________________                 │    │
│  │ Student:  ________________                 │    │
│  │                                              │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Mobile View (in Modal)
```
┌──────────────────────────┐
│ Admit Card          [X]  │
├──────────────────────────┤
│ [Print]                  │
├──────────────────────────┤
│ GurukulSarthi  [QR]     │
│ Exam Card 2025           │
│                          │
│ Name: John Doe           │
│ Roll: 1                  │
│ Class: 10-A              │
│                          │
│ Date: 15-Mar-2025        │
│ Time: 09:00-12:00        │
│ Venue: Main Hall Block A │
│                          │
│ INSTRUCTIONS             │
│ • Arrive early           │
│ • Bring ID               │
│ • No electronics         │
│                          │
│ ┌──────────┬──────────┐ │
│ │Principal │ Student  │ │
│ │ _________|_________ │ │
│ └──────────┴──────────┘ │
│                          │
└──────────────────────────┘
```

## Color Scheme

### Primary Colors
- **Primary Violet**: `#7c3aed` (Buttons, highlights)
- **Success Green**: `#22c55e` (View button)
- **Danger Red**: `#ef4444` (Delete button)
- **Blue**: `#2563eb` (Headers, icons)

### Secondary Colors
- **Background**: `#f3f4f6` (Gray-100)
- **Border**: `#d1d5db` (Gray-300)
- **Text Dark**: `#1f2937` (Gray-900)
- **Text Light**: `#6b7280` (Gray-500)

## Component States

### Filter Dropdowns
```
Normal:     [Select Exam Term ..................▼]
Disabled:   [Select Exam .......................▼] (grayed out)
Focus:      [Exam Term .........................▼] (ring-violet-600)
Hover:      [Exam Term .........................▼] (slight highlight)
```

### Buttons
```
Normal:     [👁 View]  [Delete]  [Print]
Hover:      [👁 View]  [Delete]  [Print]  (color intensifies)
Disabled:   [👁 View]  [Delete]  (grayed out, cursor-not-allowed)
Active:     [👁 View]  [Delete]  (pressed state)
```

### Table Rows
```
Default:    │ Student │ Details │
Hover:      │ Student │ Details │ (light bg highlight)
Selected:   │ Student │ Details │ (lighter blue bg)
```

### Search Input
```
Empty:      [Search student name, admission #, roll # ...]
Focus:      [Search...] (ring-violet-600, blue outline)
Typing:     [John] (live results below)
No Results: [No students found]
```

## Animation & Transitions

### Page Load
```
Time: 0ms → 200ms
Opacity: 0% → 100%
Y Position: 25px ↓ → 0px
Effect: Smooth fade-in and slide-up
```

### List Items
```
Time: 0ms → 300ms per row
Effect: Sequential fade-in
```

### Modal Open
```
Overlay: Fade in (0 → 50% black)
Modal: Slide up from bottom
Duration: 300ms
Easing: ease-out
```

## Spacing Reference

### Padding
```
Mobile:      12px (p-3)
Tablet:      16px (p-4)
Desktop:     24px (p-6)

Compact:     8px (p-2)
Standard:    12px (p-3)
Large:       16px (p-4)
Extra:       24px (p-6)
```

### Gaps
```
Compact:     8px (gap-2)
Standard:    12px (gap-3)
Large:       16px (gap-4)
```

### Margins
```
Between sections: 24px (mt-6)
Between rows:     16px (divide-y)
```

## Typography

### Text Sizes
```
Mobile              Tablet          Desktop
12px (xs)          14px (sm)       16px (base)
14px (sm)          16px (base)     18px (lg)
16px (base)        18px (lg)       20px (xl)
18px (lg)          20px (xl)       24px (2xl)
```

### Font Weights
```
Regular:   400 (normal text)
Medium:    500 (labels, headings)
Semibold:  600 (table headers)
Bold:      700 (modal titles)
```

### Line Heights
```
Compact:   1.25 (dense text)
Normal:    1.5 (default)
Relaxed:   1.75 (readable)
Loose:     2 (spaced out)
```

## Interactive Elements

### Buttons
```
┌─────────────────┐
│ [👁 View Card]  │  ← Eye icon + text
└─────────────────┘
 ↓ (on click)
Modal opens with Admit Card
```

### Search Box
```
┌──────────────────────────┐
│ Search student...        │ ← Real-time filtering
└──────────────────────────┘
 ↓ (typing)
Table updates instantly
```

### Dropdowns
```
┌──────────────────▼┐
│ Select Exam Term  │
└───────────────────┘
 ↓ (on click)
┌─────────────────┐
│ Midterm 2025-26 │
│ Final 2025-26   │
│ Supplement...   │
└─────────────────┘
 ↓ (on select)
Exams dropdown populates
```

## Print Layout

### Print-Only Styles
```css
@media print {
  .modal-buttons { display: none; }
  .modal { box-shadow: none; }
  .page-break { page-break-after: always; }
  .no-print { display: none; }
}
```

### Printed Admit Card
```
┌─────────────────────────────────────────────┐
│ GurukulSarthi School Management       [QR]  │
│ Examination Admit Card 2025                 │
├─────────────────────────────────────────────┤
│ Student Name: John Doe                      │
│ Roll Number: 1                Class: 10-A   │
│ Admission: 1001                             │
│                                             │
│ EXAMINATION DETAILS                         │
│ Date: 15-March-2025                         │
│ Time: 09:00 AM - 12:00 PM                   │
│ Venue: Main Examination Hall, Block A       │
│                                             │
│ IMPORTANT INSTRUCTIONS                      │
│ 1. Arrive 30 minutes before exam time       │
│ 2. Bring school ID and this admit card      │
│ 3. No electronic devices allowed            │
│ 4. Read instructions carefully              │
│ 5. Any malpractice = disqualification       │
│                                             │
│ Principal ________________  Student ______ │
│ Signature                   Signature       │
└─────────────────────────────────────────────┘
```

## Loading States

### Skeleton Loaders (if implemented)
```
┌────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓ (10%)   │ ← Loading bar
│                    │
│ ⟳ Loading...       │ ← Spinner
│                    │
│ Please wait while  │ ← Message
│ fetching data...   │
└────────────────────┘
```

### Error States
```
┌────────────────────────────────┐
│ ⚠️  Error                      │
│ Failed to load exams. Try again│
└────────────────────────────────┘
```

## Accessibility Features

### Keyboard Navigation
```
Tab:    Focus next element
Shift+Tab: Focus previous element
Enter:  Activate button/select
Space:  Toggle checkbox/dropdown
Esc:    Close modal
```

### Screen Reader Hints
```
<button title="View Admit Card">👁</button>
<button aria-label="Delete student">×</button>
```

### Color Contrast
```
Text on Light:   #1f2937 on #ffffff (AAA)
Text on Dark:    #ffffff on #1f2937 (AAA)
Buttons:         #ffffff on #7c3aed (AAA)
```
