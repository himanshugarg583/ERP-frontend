import React, { useState, useCallback, useMemo } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import LibraryNavbar from './LibraryNavbar';
import LibrarySidebar from './LibrarySidebar';

const TABLE_HEADERS = [
  'STUDENT ID', 'STUDENT NAME', 'BOOK ID', 'ISBN', 'BOOK TITLE', 'AUTHOR',
  'ISSUED DATE', 'DUE DATE', 'RETURN DATE', 'STATUS', 'ACTIONS',
];

const INPUT_FIELDS = [
  { id: 'studentId', label: 'Student ID', type: 'text' },
  { id: 'studentName', label: 'Student Name', type: 'text' },
  { id: 'bookTitle', label: 'Book Title', type: 'text' },
  { id: 'author', label: 'Author', type: 'text' },
  { id: 'issuedDate', label: 'Issued Date', type: 'date' },
  { id: 'dueDate', label: 'Due Date', type: 'date' },
  { id: 'returnDate', label: 'Return Date', type: 'date' },
];

const EditModal = React.memo(({ isOpen, book, onSave, onClose, onChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-xs sm:max-w-md md:max-w-lg shadow-lg">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">Edit Book Record</h2>
        <div className="max-h-80 sm:max-h-96 overflow-y-auto px-1 sm:px-2 space-y-3 sm:space-y-4">
          {INPUT_FIELDS.map(({ id, label, type }) => (
            <div key={id} className="flex flex-col">
              <label htmlFor={id} className="text-xs sm:text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                id={id}
                type={type}
                name={id}
                value={book?.[id] || ''}
                onChange={onChange}
                className="input-field"
              />
            </div>
          ))}
          <div className="flex flex-col">
            <label htmlFor="status" className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              name="status"
              value={book?.status || ''}
              onChange={onChange}
              className="input-field"
            >
              <option value="Issued">Issued</option>
              <option value="Returned">Returned</option>
            </select>
          </div>
        </div>
        <div className="mt-4 sm:mt-6 flex justify-end space-x-3 sm:space-x-4">
          <button onClick={onClose} className="btn-gray text-xs sm:text-sm">Cancel</button>
          <button onClick={onSave} className="btn-blue text-xs sm:text-sm">Save</button>
        </div>
      </div>
    </div>
  );
});

const LibraryIssued = () => {
  const [books, setBooks] = useState([
    {
      studentId: 'S001',
      studentName: 'John Doe',
      bookId: 'B001',
      isbn: '978-0-7475-3269-9',
      bookTitle: 'Harry Potter and the Philosopher\'s Stone',
      author: 'J.K. Rowling',
      issuedDate: '2025-03-01',
      dueDate: '2025-03-15',
      returnDate: null,
      status: 'Issued'
    },
    {
      studentId: 'S002',
      studentName: 'Jane Smith',
      bookId: 'B002',
      isbn: '978-0-0623-1555-7',
      bookTitle: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      issuedDate: '2025-02-25',
      dueDate: '2025-03-10',
      returnDate: '2025-03-05',
      status: 'Returned'
    },
    {
      studentId: 'S003',
      studentName: 'Mike Johnson',
      bookId: 'B003',
      isbn: '978-1-5661-9269-9',
      bookTitle: '1984',
      author: 'George Orwell',
      issuedDate: '2025-03-03',
      dueDate: '2025-03-17',
      returnDate: null,
      status: 'Issued'
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [editedBook, setEditedBook] = useState({});

  // Delete function
  const handleDelete = (bookId) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setBooks((prev) => prev.filter((book) => book.bookId !== bookId));
    }
  };

  // Edit functions
  const handleEdit = (book) => {
    setSelectedBook(book);
    setEditedBook({ ...book });
    setIsModalOpen(true);
  };

  const handleSave = useCallback(() => {
    setBooks((prev) => prev.map((book) => (book.bookId === selectedBook?.bookId ? editedBook : book)));
    setIsModalOpen(false);
    setSelectedBook(null);
});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBook(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-100 min-h-screen flex font-sans">
      <div className={`flex flex-col min-h-screen w-full ${isModalOpen ? 'blur-sm' : ''}`}>
        <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md md:left-64">
          <LibraryNavbar />
        </div>

        <div className="flex flex-1 pt-16">
          <div className="hidden md:block fixed top-16 left-0 w-64 h-full bg-white shadow-md">
            <LibrarySidebar />
          </div>
          <main className="flex-1 md:ml-64 p-2 sm:p-4 md:p-6 overflow-y-auto">
            <div className="max-w-full mx-auto">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Issued Books</h1>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto hide-scrollbar">
                  <table className="w-full border-collapse border border-gray-300 min-w-[1000px]">
                    <thead className="bg-gray-200">
                      <tr>
                        {TABLE_HEADERS.map((header) => (
                          <th key={header} className="table-header text-[10px] sm:text-xs md:text-sm p-2 sm:p-3 md:p-4">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {books.length === 0 ? (
                        <tr>
                          <td colSpan="11" className="table-empty p-4 sm:p-6 md:p-8 text-xs sm:text-sm md:text-base">
                            No books issued.
                          </td>
                        </tr>
                      ) : (
                        books.map((record) => (
                          <tr key={record.bookId} className="hover:bg-gray-50 transition-colors duration-200">
                            {['studentId', 'studentName', 'bookId', 'isbn', 'bookTitle', 'author', 'issuedDate', 'dueDate'].map((field) => (
                              <td key={field} className="table-cell text-[10px] sm:text-xs md:text-sm p-2 sm:p-3 md:p-4">
                                {record[field]}
                              </td>
                            ))}
                            <td className="table-cell text-[10px] sm:text-xs md:text-sm p-2 sm:p-3 md:p-4">
                              {record.returnDate || 'Not Returned'}
                            </td>
                            <td className="table-cell text-[10px] sm:text-xs md:text-sm p-2 sm:p-3 md:p-4">
                              <span className={`${record.status === 'Issued' ? 'text-yellow-600' : 'text-green-600'} font-medium`}>
                                {record.status}
                              </span>
                            </td>
                            <td className="table-cell text-[10px] sm:text-xs md:text-sm p-2 sm:p-3 md:p-4">
                              <button className="btn-icon text-indigo-600 mr-2 sm:mr-4" onClick={() => handleEdit(record)} aria-label="Edit">
                                <FaEdit />
                              </button>
                              <button className="btn-icon text-red-600" onClick={() => handleDelete(record.bookId)} aria-label="Delete">
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Book Record</h2>
            <div className="max-h-96 overflow-y-auto px-2">
              <form className="space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="studentId" className="text-sm font-medium text-gray-700 mb-1">
                    Student ID
                  </label>
                  <input
                    id="studentId"
                    type="text"
                    name="studentId"
                    value={editedBook.studentId || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Student ID"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="studentName" className="text-sm font-medium text-gray-700 mb-1">
                    Student Name
                  </label>
                  <input
                    id="studentName"
                    type="text"
                    name="studentName"
                    value={editedBook.studentName || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Student Name"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="bookTitle" className="text-sm font-medium text-gray-700 mb-1">
                    Book Title
                  </label>
                  <input
                    id="bookTitle"
                    type="text"
                    name="bookTitle"
                    value={editedBook.bookTitle || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Book Title"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="author" className="text-sm font-medium text-gray-700 mb-1">
                    Author
                  </label>
                  <input
                    id="author"
                    type="text"
                    name="author"
                    value={editedBook.author || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Author Name"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="issuedDate" className="text-sm font-medium text-gray-700 mb-1">
                    Issued Date
                  </label>
                  <input
                    id="issuedDate"
                    type="date"
                    name="issuedDate"
                    value={editedBook.issuedDate || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="dueDate" className="text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    id="dueDate"
                    type="date"
                    name="dueDate"
                    value={editedBook.dueDate || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="returnDate" className="text-sm font-medium text-gray-700 mb-1">
                    Return Date
                  </label>
                  <input
                    id="returnDate"
                    type="date"
                    name="returnDate"
                    value={editedBook.returnDate || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="status" className="text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={editedBook.status || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Issued">Issued</option>
                    <option value="Returned">Returned</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .blur-sm { filter: blur(4px); }
        .table-header {
          text-align: left;
          font-weight: 600;
          color: #2d3748;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid #d1d5db;
          white-space: nowrap;
        }
        .table-cell {
          color: #4a5568;
          border: 1px solid #d1d5db;
          white-space: nowrap;
        }
        .table-empty {
          text-align: center;
          color: #a0aec0;
          border: 1px solid #d1d5db;
        }
        .btn-gray {
          padding: 0.5rem 1rem;
          background: #edf2f7;
          color: #2d3748;
          border-radius: 0.375rem;
          transition: background 0.2s;
        }
        .btn-gray:hover { background: #e2e8f0; }
        .btn-blue {
          padding: 0.5rem 1rem;
          background: #2563eb;
          color: white;
          border-radius: 0.375rem;
          transition: background 0.2s;
        }
        .btn-blue:hover { background: #1d4ed8; }
        .btn-icon {
          transform: scale(1);
          transition: all 0.2s;
        }
        .btn-icon:hover { transform: scale(1.1); }
        .input-field {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          line-height: 1.25rem;
        }
        @media (min-width: 640px) {
          .input-field {
            font-size: 0.875rem;
            line-height: 1.5rem;
          }
        }
        .input-field:focus {
          outline: none;
          ring: 2px solid #2563eb;
        }
      `}</style>
    </div>
  );
};

export default LibraryIssued;