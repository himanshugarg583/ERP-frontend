# Admit Card Feature - Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React)                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                    AdmitCardPage                              │ │
│  │         (Container Component - src/Pages/admin/)             │ │
│  └────────────────────────┬────────────────────────────────────┘ │
│                           │                                        │
│                           ▼                                        │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │              CreateAdmitCard Component                         │ │
│  │  (Main Logic - src/components/examanitaion/)                 │ │
│  │                                                               │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │ │
│  │  │   Filter     │  │    Table     │  │    Modal     │       │ │
│  │  │   Section    │  │   Display    │  │   (Print)    │       │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘       │ │
│  │       │                    │                    │             │ │
│  │       └────────────────────┴────────────────────┘             │ │
│  │               ▼                                               │ │
│  │        ┌──────────────────┐                                  │ │
│  │        │  Admit Component │                                  │ │
│  │        │  (Display Card)  │                                  │ │
│  │        └──────────────────┘                                  │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                           │                                        │
│  ┌────────────────────────▼────────────────────────────────────┐  │
│  │            API Methods (Helper Functions)                   │  │
│  │   (src/helper/requests-method/apiMethods.js)               │  │
│  │                                                             │  │
│  │  • getAllExamTermsForAdmitCard()                           │  │
│  │  • getExamByTerm(termId)                                   │  │
│  │  • getStudentAdmitCard(studentId, termId)                 │  │
│  │  • getAllStudents()                                        │  │
│  │  ... and 2 more functions                                  │  │
│  └────────────────────────┬────────────────────────────────────┘  │
│                           │                                        │
└───────────────────────────┼────────────────────────────────────────┘
                            │
                   (HTTP Requests with JWT)
                            │
┌───────────────────────────▼────────────────────────────────────────┐
│                      BACKEND (API Server)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  GET /admin/dropdown/getExamTermDropdown                           │
│      ↓                                                              │
│      → Returns: [ { id, term_name, academic_year } ]             │
│                                                                     │
│  GET /admin/dropdown/getExamDropdown?term_id=:id                 │
│      ↓                                                              │
│      → Returns: [ { id, exam_name } ]                            │
│                                                                     │
│  GET /admin/studentInfo/getAllStudents                            │
│      ↓                                                              │
│      → Returns: [ { id, name, admission_number, roll_number } ]  │
│                                                                     │
│  GET /admin/admitCard/getStudentAdmitCard                         │
│      ?student_id=:id&exam_schedule_id=:id                        │
│      ↓                                                              │
│      → Returns: { exam_date, exam_time, venue, ... }             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
USER INTERACTION
     │
     ▼
┌─────────────────────────────┐
│ Select Exam Term Dropdown   │
│ (onChange handler triggers) │
└──────────────┬──────────────┘
               │
               ▼
         setSelectedExamTerm()
               │
               ▼
        useEffect triggered
               │
               ▼
    getExamByTerm(termId)
               │
               ▼
         API Call ──┐
                    │
                    └──→ Backend /admin/dropdown/getExamDropdown
                             │
                             ▼
                    Response with Exams
                             │
                             ▼
                      setExams(response)
                             │
                             ▼
               Exam Dropdown Populated
                             │
                             ▼
        ┌──────────────────────────────┐
        │ Select Exam Name Dropdown    │
        │ (onChange handler triggers)  │
        └──────────────┬───────────────┘
                       │
                       ▼
                setSelectedExam()
                       │
                       ▼
            View Button Becomes Enabled
                       │
                       ▼
        ┌──────────────────────────────┐
        │ User Clicks View Button      │
        │ (For specific student)       │
        └──────────────┬───────────────┘
                       │
                       ▼
            Validation Check
            (Both selected?)
                       │
            ┌──────────┴──────────┐
            │ Yes        │       No│
            ▼            │        ▼
        API Call         │    Show Error
            │            │
            ▼            │
getStudentAdmitCard()    │
            │            │
            ▼            │
    Backend Endpoint     │
            │            │
            ▼            │
    Returns Card Data    │
            │            │
            ▼            │
    Set Modal Data       │
            │            │
            └──────┬─────┘
                   │
                   ▼
         Modal Opens with Card
                   │
                   ▼
        ┌──────────────────────┐
        │ User Actions:        │
        │ 1. Print (Ctrl+P)    │
        │ 2. Close Modal       │
        └──────────────────────┘
```

---

## Component Hierarchy

```
App
 └─ Routes
     └─ ProtectedRoute
         └─ AdmitCardPage
             ├─ Header
             ├─ Sidebar
             └─ CreateAdmitCard
                 ├─ Filter Section
                 │   ├─ Exam Term Select
                 │   ├─ Exam Name Select
                 │   └─ Student Search
                 │
                 ├─ Loading Indicator (conditional)
                 │
                 ├─ Error Display (conditional)
                 │
                 ├─ Students Table
                 │   └─ Table Rows
                 │       └─ Action Buttons
                 │
                 ├─ Pagination Controls
                 │   ├─ Previous Button
                 │   ├─ Page Numbers
                 │   └─ Next Button
                 │
                 └─ ReactModal
                     └─ AdmitCard Component
                         ├─ Header
                         ├─ Student Details Grid
                         ├─ Exam Details Grid
                         ├─ Instructions Section
                         ├─ Signature Block
                         └─ Print Button
```

---

## State Management Flow

```
Initial State (on mount)
         │
         ▼
    useEffect Hook 1
         │
    ┌────┴───┐
    │        │
    ▼        ▼
Fetch      Fetch
Exam       Students
Terms      (1000 limit)
    │        │
    └────┬───┘
         │
         ▼
  setExamTerms()
  setStudents()
         │
         ▼
┌──────────────────────────────────────┐
│ Component Renders with Data          │
├──────────────────────────────────────┤
│ examTerms: [{...}, {...}]           │
│ exams: []                            │
│ students: [{...}, {...}, ...]       │
│ selectedExamTerm: ''                │
│ selectedExam: ''                     │
│ filteredStudents: [...students]     │
│ loading: false                       │
│ error: ''                            │
└──────────────────────────────────────┘
         │
         ▼
   User Selects Exam Term
         │
         ▼
    useEffect Hook 2 (depends on selectedExamTerm)
         │
         ▼
    getExamByTerm(termId)
         │
         ▼
    setExams(response.data)
         │
         ▼
   Exam Dropdown Updates
         │
         ▼
   User Selects Exam
         │
         ▼
    setSelectedExam()
         │
         ▼
   View Button Enabled
         │
         ▼
   User Searches Student
         │
         ▼
    useEffect Hook 3 (depends on searchTerm, students)
         │
         ▼
    setFilteredStudents(filtered)
         │
         ▼
    setCurrentPage(1)
         │
         ▼
   Table Updates
         │
         ▼
   User Clicks View
         │
         ▼
  handleViewAdmitCard()
         │
         ▼
    getStudentAdmitCard()
         │
         ▼
    setSelectedReceipt()
    setIsModalOpen(true)
         │
         ▼
   Modal Opens
```

---

## API Call Sequence Diagram

```
┌──────────┐                                    ┌────────┐
│ Frontend │                                    │Backend │
└────┬─────┘                                    └───┬────┘
     │                                              │
     │─ 1. getAllExamTermsForAdmitCard() ───────►  │
     │    GET /admin/dropdown/                    │
     │    getExamTermDropdown                     │
     │                                              │
     │                                    ┌─────────────────┐
     │                                    │ Fetch exam      │
     │                                    │ terms from DB   │
     │                                    └─────────────────┘
     │                                              │
     │◄─ Response: [{id, term_name, year}] ────── │
     │                                              │
     │ (User selects exam term)                    │
     │                                              │
     │─ 2. getExamByTerm(termId) ────────────────► │
     │    GET /admin/dropdown/                    │
     │    getExamDropdown?term_id=1               │
     │                                              │
     │                                    ┌─────────────────┐
     │                                    │ Fetch exams     │
     │                                    │ for term        │
     │                                    └─────────────────┘
     │                                              │
     │◄─ Response: [{id, exam_name}] ───────────── │
     │                                              │
     │ (User selects exam)                        │
     │                                              │
     │─ 3. getAllStudents(1, 1000) ──────────────► │
     │    GET /admin/studentInfo/                 │
     │    getAllStudents?page=1&limit=1000       │
     │                                              │
     │                                    ┌─────────────────┐
     │                                    │ Fetch students  │
     │                                    │ from DB         │
     │                                    └─────────────────┘
     │                                              │
     │◄─ Response: [{id, name, roll, ...}] ────── │
     │                                              │
     │ (User clicks View for a student)           │
     │                                              │
     │─ 4. getStudentAdmitCard(                   │
     │     studentId, termId) ──────────────────► │
     │    GET /admin/admitCard/                   │
     │    getStudentAdmitCard?                    │
     │    student_id=1&exam_schedule_id=1       │
     │                                              │
     │                                    ┌─────────────────┐
     │                                    │ Fetch admit     │
     │                                    │ card details    │
     │                                    │ for student     │
     │                                    └─────────────────┘
     │                                              │
     │◄─ Response: {exam_date, time, venue} ───── │
     │                                              │
     │ (Modal opens with admit card)              │
```

---

## Error Handling Flow

```
┌─────────────────────────┐
│ API Call Initiated      │
└────────────┬────────────┘
             │
             ▼
    ┌────────────────┐
    │ Try Block      │
    └────────┬───────┘
             │
         ┌───┴────────────────────┐
         │ API Response Received   │
         └───┬────────────────────┘
             │
             ▼
    ┌─────────────────┐
    │ Success Check   │
    └────┬────────────┘
         │
    ┌────┴──────────────┐
    │                   │
    ▼ Yes               ▼ No
 Success             Error
    │                  │
    ▼                  ▼
Update State      setError(msg)
    │                  │
    └─────────────┬────┘
                  │
                  ▼
    ┌──────────────────────────┐
    │ Catch Block              │
    │ (Network/Parse Error)    │
    └────────────┬─────────────┘
                 │
                 ▼
    ┌──────────────────────────┐
    │ Check Error Type         │
    └─┬──────────┬──────────┬──┘
      │          │          │
      ▼          ▼          ▼
    401      403         404       Other
 (Unauth)  (Forbidden) (Not Found) (Error)
    │          │          │          │
    ▼          ▼          ▼          ▼
Session   Permission Document  Network/
Expired   Denied    Not Found   Parse
    │          │          │          │
    └─────────────┬───────────────────┘
                  │
                  ▼
    ┌─────────────────────────┐
    │ Display Error Message   │
    │ to User                 │
    └─────────────────────────┘
                  │
                  ▼
    ┌─────────────────────────┐
    │ Finally Block           │
    │ setLoading(false)       │
    └─────────────────────────┘
```

---

## Responsive Design Breakpoints

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Responsive Design System                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  0px ◄─── Mobile ───► 640px ◄── Tablet ──► 1024px ◄─ Desktop ──►  │
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐        │
│  │   Mobile     │    │   Tablet     │    │   Desktop    │        │
│  │  (375px)     │    │   (768px)    │    │  (1920px)    │        │
│  ├──────────────┤    ├──────────────┤    ├──────────────┤        │
│  │• 1 Column    │    │• 2 Columns   │    │• 3 Columns   │        │
│  │• Compact     │    │• Standard    │    │• Full Width  │        │
│  │• Hidden cols │    │• More cols   │    │• All cols    │        │
│  │• sm icons    │    │• md icons    │    │• lg icons    │        │
│  │• xs text     │    │• sm text     │    │• md text     │        │
│  │• px-4        │    │• px-6        │    │• px-6        │        │
│  │• py-3        │    │• py-4        │    │• py-6        │        │
│  └──────────────┘    └──────────────┘    └──────────────┘        │
│                                                                     │
│  Tailwind Breakpoints:                                            │
│  • sm:  640px  (portrait tablets)                                 │
│  • md:  768px  (landscape tablets)                                │
│  • lg:  1024px (small desktops)                                   │
│  • xl:  1280px (large desktops)                                   │
│  • 2xl: 1536px (ultra-wide)                                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Modal Window Flow

```
┌─────────────────────────────┐
│ User Clicks View Button     │
│ on Table Row                │
└────────────┬────────────────┘
             │
             ▼
    ┌─────────────────────┐
    │ Validation Check    │
    │ ExamTerm selected?  │
    │ Exam selected?      │
    └──────┬──────────────┘
           │
       ┌───┴──────────────┐
       │ Yes              │ No
       ▼                  ▼
  API Call         Show Error
       │                  │
       ▼                  │
  setLoading(true)        │
       │                  │
       ▼                  │
  getStudentAdmitCard()   │
       │                  │
       ▼                  │
  Response Received       │
       │                  │
       ▼                  │
  setSelectedReceipt()    │
  setIsModalOpen(true)    │
       │                  │
       └────────┬─────────┘
                │
                ▼
    ┌───────────────────────┐
    │ Modal Opens (Overlay) │
    │ with Admit Card Data  │
    └────────┬──────────────┘
             │
    ┌────────┴────────────────┐
    │ User Options:           │
    │                         │
    │ 1. Click Print Button   │
    │    └─► Print Dialog     │
    │        └─► Browser Print│
    │                         │
    │ 2. Click Close [X]      │
    │    └─► Modal Closes     │
    │                         │
    │ 3. Click Overlay (ESC)  │
    │    └─► Modal Closes     │
    └───────────────────────┘
```

---

## Performance Optimization Areas

```
┌─────────────────────────────────────────────────────┐
│     Performance Optimization Opportunities          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Search Debouncing                             │
│     Current: Immediate update                     │
│     Optimized: 300ms debounce                    │
│     Impact: Reduce re-renders by 80%             │
│                                                     │
│  2. Memoization                                    │
│     Current: Recalculate on every render         │
│     Optimized: useMemo + useCallback              │
│     Impact: Faster filtering and pagination      │
│                                                     │
│  3. Lazy Loading                                   │
│     Current: Load all 1000 students              │
│     Optimized: Load 100 at a time                │
│     Impact: Faster initial load (3x)             │
│                                                     │
│  4. API Caching                                    │
│     Current: Fresh API calls always              │
│     Optimized: Cache exam terms/exams            │
│     Impact: Reduce API calls by 60%              │
│                                                     │
│  5. Image Optimization                            │
│     Current: No images                           │
│     Future: Optimize student photos              │
│     Impact: Reduce load time                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Integration Points

```
┌────────────────────────────────────────────────────┐
│           ERP Frontend Integration                  │
├────────────────────────────────────────────────────┤
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ Authentication (AuthContext)                 │ │
│  │ • JWT Token from localStorage               │ │
│  │ • User role verification                    │ │
│  │ • Session management                        │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ Theme Context (ThemeContext)                 │ │
│  │ • Dark/Light mode support                   │ │
│  │ • Color scheme consistency                  │ │
│  │ • Tailwind integration                      │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ Routing (Routes.jsx)                         │ │
│  │ • Protected Route wrapper                   │ │
│  │ • Admin access verification                 │ │
│  │ • Navigation integration                    │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ API Methods (apiMethods.js)                  │ │
│  │ • Centralized endpoint management           │ │
│  │ • Authorization headers                     │ │
│  │ • Error handling                            │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## Data Structure References

```
Exam Term:
{
  id: number,
  term_name: string,
  academic_year: string
}

Exam:
{
  id: number,
  exam_name: string
}

Student:
{
  id: number,
  name: string,
  admission_number: string,
  roll_number: number,
  class_name: string,
  section_name: string
}

Admit Card:
{
  exam_date: string (YYYY-MM-DD),
  exam_time: string (HH:MM AM/PM - HH:MM AM/PM),
  venue: string,
  subject?: string,
  ...other fields
}

Exam Schedule:
{
  date: string,
  time: string,
  subject: string,
  duration: string
}
```

---

**End of Diagrams**
