# Admit Card Feature - Code Examples & Snippets

## Using the API Functions

### Example 1: Fetch All Exam Terms
```javascript
import { getAllExamTermsForAdmitCard } from '../../helper/requests-method/apiMethods';

const loadExamTerms = async () => {
  try {
    const response = await getAllExamTermsForAdmitCard();
    
    if (response.success) {
      console.log('Exam Terms:', response.data);
      // Response format:
      // [
      //   { id: 1, term_name: "Midterm", academic_year: "2025-26" },
      //   { id: 2, term_name: "Final", academic_year: "2025-26" }
      // ]
      
      setExamTerms(response.data);
    }
  } catch (error) {
    console.error('Error fetching exam terms:', error);
    setError('Failed to load exam terms');
  }
};
```

### Example 2: Fetch Exams by Term
```javascript
import { getExamByTerm } from '../../helper/requests-method/apiMethods';

const loadExams = async (examTermId) => {
  try {
    const response = await getExamByTerm(examTermId);
    
    if (response.success) {
      console.log('Exams:', response.data);
      // Response format:
      // [
      //   { id: 1, exam_name: "First Mid Term" },
      //   { id: 2, exam_name: "Second Mid Term" }
      // ]
      
      setExams(response.data);
    }
  } catch (error) {
    console.error('Error fetching exams:', error);
    setError('Failed to load exams');
  }
};
```

### Example 3: Fetch Student Admit Card
```javascript
import { getStudentAdmitCard } from '../../helper/requests-method/apiMethods';

const loadAdmitCard = async (studentId, examTermId) => {
  try {
    const response = await getStudentAdmitCard(studentId, examTermId);
    
    if (response.success && response.data) {
      console.log('Admit Card:', response.data);
      // Response format:
      // {
      //   exam_date: "2025-03-15",
      //   exam_time: "09:00 AM - 12:00 PM",
      //   venue: "Main Hall, Block A",
      //   subject: "Mathematics",
      //   roll_number: "1",
      //   ...other fields
      // }
      
      setAdmitCardData(response.data);
    }
  } catch (error) {
    console.error('Error fetching admit card:', error);
    setError('Failed to load admit card');
  }
};
```

### Example 4: Fetch All Students
```javascript
import { getAllStudents } from '../../helper/requests-method/apiMethods';

const loadStudents = async () => {
  try {
    // Fetch first 1000 students
    const response = await getAllStudents(1, 1000);
    
    if (response.success && response.data) {
      console.log('Students:', response.data);
      // Response format:
      // [
      //   {
      //     id: 1,
      //     name: "John Doe",
      //     admission_number: "1001",
      //     roll_number: 1,
      //     class_name: "10",
      //     section_name: "A"
      //   },
      //   ...more students
      // ]
      
      setStudents(response.data);
    }
  } catch (error) {
    console.error('Error fetching students:', error);
    setError('Failed to load students');
  }
};
```

---

## Component Usage Examples

### Example 1: Basic Usage
```javascript
import CreateAdmitCard from '../components/examanitaion/CreateAdmitCard';

function AdminPage() {
  return (
    <CreateAdmitCard
      tabletitle="Admit Card Management"
      title1="Student Name"
      title2="Admission #"
      title3="Roll No"
      title4="Class"
      title5="Actions"
    />
  );
}
```

### Example 2: Using Admit Card Component
```javascript
import AdmitCard from '../components/examanitaion/Admit';

function PrintAdmitCard() {
  return (
    <AdmitCard
      studentName="John Doe"
      rollNumber="1"
      className="10-A"
      examDate="15-March-2025"
      examTime="09:00 AM - 12:00 PM"
      examVenue="Main Examination Hall, Block A"
      examSchedule={[
        {
          date: "15-Mar-2025",
          time: "09:00 AM - 12:00 PM",
          subject: "Mathematics",
          duration: "3 hours"
        },
        {
          date: "16-Mar-2025",
          time: "09:00 AM - 12:00 PM",
          subject: "English",
          duration: "3 hours"
        }
      ]}
    />
  );
}
```

---

## State Management Patterns

### Pattern 1: Loading Data with useEffect
```javascript
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getAllExamTermsForAdmitCard();
      
      if (response.success) {
        setExamTerms(response.data);
      } else {
        setError(response.message || 'Failed to fetch data');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

### Pattern 2: Cascading Dropdowns
```javascript
// When exam term changes, fetch exams
useEffect(() => {
  if (!selectedExamTerm) {
    setExams([]);
    setSelectedExam('');
    return;
  }
  
  const fetchExams = async () => {
    try {
      const response = await getExamByTerm(selectedExamTerm);
      if (response.success) {
        setExams(response.data);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };
  
  fetchExams();
}, [selectedExamTerm]);
```

### Pattern 3: Client-Side Search/Filter
```javascript
useEffect(() => {
  if (!searchTerm.trim()) {
    setFilteredStudents(students);
  } else {
    const filtered = students.filter(student =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admission_number?.toString().includes(searchTerm) ||
      student.roll_number?.toString().includes(searchTerm)
    );
    setFilteredStudents(filtered);
  }
  setCurrentPage(1); // Reset to first page
}, [searchTerm, students]);
```

### Pattern 4: Pagination
```javascript
const itemsPerPage = 8;
const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

const paginatedStudents = filteredStudents.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

const goToPage = (pageNumber) => {
  setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
};
```

---

## Error Handling Patterns

### Pattern 1: Try-Catch with User Feedback
```javascript
const handleViewAdmitCard = async (student) => {
  try {
    // Validation
    if (!selectedExamTerm || !selectedExam) {
      setError('Please select both Exam Term and Exam');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // API Call
    const response = await getStudentAdmitCard(student.id, selectedExamTerm);
    
    // Success
    if (response.success && response.data) {
      setAdmitCardData(response.data);
      setIsModalOpen(true);
    } else {
      setError(response.message || 'Failed to load admit card');
    }
  } catch (error) {
    console.error('Error:', error);
    
    // Check for specific error types
    if (error.response?.status === 401) {
      setError('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      setError('You do not have permission to view this admit card.');
    } else if (error.response?.status === 404) {
      setError('Admit card not found.');
    } else {
      setError('Failed to load admit card. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};
```

### Pattern 2: Validation
```javascript
const validateSelectionsAndPerformAction = () => {
  const errors = [];
  
  if (!selectedExamTerm) {
    errors.push('Exam Term is required');
  }
  
  if (!selectedExam) {
    errors.push('Exam is required');
  }
  
  if (!selectedStudent) {
    errors.push('Student is required');
  }
  
  if (errors.length > 0) {
    setError(errors.join(', '));
    return false;
  }
  
  return true;
};
```

---

## Responsive Design Patterns

### Pattern 1: Conditional Rendering Based on Screen Size
```javascript
// Hide on mobile, show on tablet+
<div className="hidden sm:table-cell">
  {student.admission_number}
</div>

// Hide on tablet, show on desktop+
<div className="hidden md:table-cell">
  {student.class_name} - {student.section_name}
</div>
```

### Pattern 2: Responsive Grid
```javascript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
</div>
```

### Pattern 3: Responsive Padding/Margin
```javascript
<div className="px-4 sm:px-6 py-3 sm:py-4">
  {/* Mobile: 16px horizontal, 12px vertical */}
  {/* Tablet+: 24px horizontal, 16px vertical */}
</div>
```

### Pattern 4: Responsive Text Sizes
```javascript
<h1 className="text-lg sm:text-2xl">
  {/* Mobile: 18px, Tablet+: 24px */}
</h1>

<p className="text-xs sm:text-sm">
  {/* Mobile: 12px, Tablet+: 14px */}
</p>
```

---

## Testing Snippets

### Test 1: Check API Integration
```javascript
// Run in browser console
(async () => {
  const apiMethods = await import('./helper/requests-method/apiMethods.js');
  
  // Test exam terms
  const terms = await apiMethods.getAllExamTermsForAdmitCard();
  console.log('Exam Terms:', terms);
  
  // Test exams
  if (terms.data && terms.data.length > 0) {
    const exams = await apiMethods.getExamByTerm(terms.data[0].id);
    console.log('Exams:', exams);
  }
})();
```

### Test 2: Simulate Data
```javascript
// Test component with mock data
const mockExamTerms = [
  { id: 1, term_name: "Midterm", academic_year: "2025-26" },
  { id: 2, term_name: "Final", academic_year: "2025-26" }
];

const mockExams = [
  { id: 1, exam_name: "First Mid Term" },
  { id: 2, exam_name: "Second Mid Term" }
];

const mockStudents = [
  {
    id: 1,
    name: "John Doe",
    admission_number: "1001",
    roll_number: 1,
    class_name: "10",
    section_name: "A"
  },
  {
    id: 2,
    name: "Jane Smith",
    admission_number: "1002",
    roll_number: 2,
    class_name: "10",
    section_name: "A"
  }
];
```

### Test 3: Component Rendering
```javascript
import { render, screen } from '@testing-library/react';
import CreateAdmitCard from './CreateAdmitCard';

test('renders admit card component', () => {
  render(<CreateAdmitCard />);
  
  expect(screen.getByText('Select Criteria')).toBeInTheDocument();
  expect(screen.getByLabelText('Exam Term')).toBeInTheDocument();
  expect(screen.getByLabelText('Exam Name')).toBeInTheDocument();
});
```

---

## Performance Optimization Snippets

### Optimization 1: Debounce Search
```javascript
import { useCallback } from 'react';
import { debounce } from 'lodash';

const debouncedSearch = useCallback(
  debounce((term) => {
    setSearchTerm(term);
  }, 300),
  []
);

const handleSearch = (e) => {
  debouncedSearch(e.target.value);
};
```

### Optimization 2: Memoize Filtered Results
```javascript
import { useMemo } from 'react';

const filteredStudents = useMemo(() => {
  if (!searchTerm.trim()) {
    return students;
  }
  
  return students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admission_number?.toString().includes(searchTerm)
  );
}, [students, searchTerm]);
```

### Optimization 3: Cache API Responses
```javascript
import { useRef } from 'react';

const cacheRef = useRef({});

const getExamsWithCache = async (termId) => {
  const cacheKey = `exams_${termId}`;
  
  if (cacheRef.current[cacheKey]) {
    return cacheRef.current[cacheKey];
  }
  
  const response = await getExamByTerm(termId);
  cacheRef.current[cacheKey] = response;
  
  return response;
};
```

---

## Integration Examples

### Example 1: Integrate with Redux
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { setExamTerms, setExams } from '../store/slices/examSlice';

const CreateAdmitCard = () => {
  const dispatch = useDispatch();
  const { examTerms, exams } = useSelector(state => state.exam);
  
  useEffect(() => {
    const fetchTerms = async () => {
      const response = await getAllExamTermsForAdmitCard();
      dispatch(setExamTerms(response.data));
    };
    fetchTerms();
  }, [dispatch]);
  
  return (
    // Component JSX
  );
};
```

### Example 2: Integrate with Context
```javascript
import { useContext } from 'react';
import { ExamContext } from '../context/ExamContext';

const CreateAdmitCard = () => {
  const { examTerms, setExamTerms, exams, setExams } = useContext(ExamContext);
  
  // Use context values
};
```

### Example 3: Navigation Integration
```javascript
import { useNavigate } from 'react-router-dom';

const CreateAdmitCard = () => {
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    navigate('/admin/students', {
      state: { successMessage: 'Admit card generated successfully' }
    });
  };
  
  return (
    // Component JSX
  );
};
```

---

## Common Issues & Solutions

### Issue 1: CORS Error
```javascript
// Problem: Cross-Origin Request Blocked
// Solution: Ensure backend allows the frontend URL in CORS config

// Backend (Express):
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true
}));
```

### Issue 2: 401 Unauthorized
```javascript
// Problem: Invalid or expired JWT token
// Solution: Check localStorage for authToken

const handleUnauthorized = () => {
  localStorage.removeItem('authToken');
  window.location.href = '/login';
};
```

### Issue 3: Network Timeout
```javascript
// Problem: API request takes too long
// Solution: Add timeout and retry logic

import axios from 'axios';

const axiosInstance = axios.create({
  timeout: 10000, // 10 seconds
  baseURL: 'http://localhost:5000'
});

// Add retry logic
const retryRequest = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};
```

---

## Documentation Links

- [React Hooks Documentation](https://react.dev/reference/react)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React Modal Documentation](https://reactcommunity.org/react-modal/)
- [Lucide Icons](https://lucide.dev/)
- [Font Awesome Icons](https://fontawesome.com/docs/web/use-with/react/)
