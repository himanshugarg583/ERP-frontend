import React, { useState, useEffect } from 'react';
import { FaHome, FaSearch, FaUser, FaPlus, FaEye, FaTimes, FaBook, FaTag, FaBarcode, FaIdCard, FaMapMarkerAlt, FaCalendarAlt, FaBuilding, FaCopy, FaEdit } from 'react-icons/fa';
import LibraryNavbar from './LibraryNavbar';
import LibrarySidebar from './LibrarySidebar';

const LibraryAddNew = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [books, setBooks] = useState(() => JSON.parse(localStorage.getItem('books')) || []);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '', author: '', genre: '', publicationYear: '', publisher: '', copies: '', edition: '', shelf: ''
  });

  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  const handleInputChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddBook = (e) => {
    e.preventDefault();
    const newBook = {
      title: formData.title,
      author: formData.author,
      genre: formData.genre,
      isbn: `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      bookId: `BK${(books.length + 1).toString().padStart(3, '0')}`,
      shelf: formData.shelf || `A-${Math.floor(Math.random() * 20)}-${Math.floor(Math.random() * 20)}`,
      publicationYear: formData.publicationYear,
      publisher: formData.publisher,
      copies: formData.copies,
      edition: formData.edition
    };
    setBooks((prev) => [...prev, newBook]);
    setFormData({ title: '', author: '', genre: '', publicationYear: '', publisher: '', copies: '', edition: '', shelf: '' });
    setIsModalOpen(false);
  };

  const handleViewBook = (book) => {
    setSelectedBook(book);
    setIsViewModalOpen(true);
  };

  const inputFields = [
    { name: 'title', label: 'Book Title', placeholder: 'Enter book title', required: true },
    { name: 'author', label: 'Author', placeholder: 'Enter author name', required: true },
    { name: 'genre', label: 'Genre', placeholder: 'Enter genre', required: true },
    { name: 'publicationYear', label: 'Publication Year', placeholder: 'Enter publication year' },
    { name: 'publisher', label: 'Publisher', placeholder: 'Enter publisher' },
    { name: 'copies', label: 'Number of Copies', placeholder: 'Enter number of copies', type: 'number', min: 1 },
    { name: 'edition', label: 'Edition', placeholder: 'Enter edition' },
    { name: 'shelf', label: 'Shelf Location', placeholder: 'Enter shelf location (e.g., A-1-10)' }
  ];

  const bookDetails = [
    { icon: FaBook, label: 'Title', value: selectedBook?.title },
    { icon: FaUser, label: 'Author', value: selectedBook?.author },
    { icon: FaTag, label: 'Genre', value: selectedBook?.genre },
    { icon: FaBarcode, label: 'ISBN', value: selectedBook?.isbn },
    { icon: FaIdCard, label: 'Book ID', value: selectedBook?.bookId },
    { icon: FaMapMarkerAlt, label: 'Shelf', value: selectedBook?.shelf },
    { icon: FaCalendarAlt, label: 'Pub. Year', value: selectedBook?.publicationYear },
    { icon: FaBuilding, label: 'Publisher', value: selectedBook?.publisher },
    { icon: FaCopy, label: 'Copies', value: selectedBook?.copies },
    { icon: FaEdit, label: 'Edition', value: selectedBook?.edition }
  ];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
      setIsViewModalOpen(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex font-sans">
      <div className={`flex flex-col min-h-screen w-full ${isModalOpen || isViewModalOpen ? 'blur-sm' : ''}`}>
        <div className="fixed top-0 left-0 right-0 z-20 bg-white shadow-md md:left-64">
          <LibraryNavbar />
        </div>
        <div className="flex flex-1 pt-16">
          <div className="hidden md:block fixed top-16 left-0 w-64 h-full bg-white shadow-md">
            <LibrarySidebar />
          </div>
          <main className="flex-1 p-4 sm:p-6 md:ml-64 overflow-y-auto">
            <div className="max-w-full mx-auto">
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Book Management</h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage your library collection efficiently</p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg font-semibold flex items-center justify-center hover:from-blue-700 hover:to-blue-800 transition-all hover:scale-105 shadow-md w-full sm:w-auto text-sm sm:text-base"
                  >
                    <FaPlus className="mr-1 sm:mr-2 text-xs sm:text-sm" /> Add New Book
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm overflow-x-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-200">
                <table className="w-full border-collapse border border-gray-300 min-w-[768px]">
                  <thead className="bg-gray-200">
                    <tr>
                      {['Title', 'Author', 'Genre', 'ISBN', 'Book ID', 'Shelf', 'Actions'].map((header, idx) => (
                        <th key={header} className={`px-2 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider border border-gray-300 ${idx === 2 ? 'hidden sm:table-cell' : idx > 2 && idx < 5 ? 'hidden md:table-cell' : idx === 5 ? 'hidden lg:table-cell' : ''}`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {!books.length ? (
                      <tr>
                        <td colSpan="7" className="px-4 sm:px-6 py-12 text-center text-gray-500 border border-gray-300">
                          <div className="flex flex-col items-center">
                            <FaPlus className="text-2xl sm:text-3xl mb-2 text-gray-400" />
                            <p className="text-sm">No books added yet. Click "Add New Book" to start.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      books.map((book, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-2 sm:px-6 py-3 sm:py-4 text-sm text-gray-900 border border-gray-300 whitespace-nowrap">{book.title}</td>
                          <td className="px-2 sm:px-6 py-3 sm:py-4 text-sm text-gray-900 border border-gray-300 whitespace-nowrap">{book.author}</td>
                          <td className="px-2 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 border border-gray-300 hidden sm:table-cell whitespace-nowrap">{book.genre}</td>
                          <td className="px-2 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 border border-gray-300 hidden md:table-cell whitespace-nowrap">{book.isbn}</td>
                          <td className="px-2 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 border border-gray-300 hidden md:table-cell whitespace-nowrap">{book.bookId}</td>
                          <td className="px-2 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 border border-gray-300 hidden lg:table-cell whitespace-nowrap">{book.shelf}</td>
                          <td className="px-2 sm:px-6 py-3 sm:py-4 border border-gray-300">
                            <button
                              onClick={() => handleViewBook(book)}
                              className="bg-blue-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-md hover:bg-blue-700 transition-all hover:scale-105 flex items-center justify-center gap-1 text-xs sm:text-sm shadow-sm w-full sm:w-auto"
                            >
                              <FaEye className="text-xs" /> View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Add New Book Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 p-4" onClick={handleBackdropClick}>
          <div className="bg-white rounded-xl w-[32rem] p-6 shadow-xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Add New Book</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 transition-colors p-2">
                <FaTimes size={24} />
              </button>
            </div>
            <form onSubmit={handleAddBook} className="space-y-5">
              {inputFields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-semibold text-gray-700">{field.label}</label>
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    required={field.required || false}
                    min={field.min}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all hover:scale-105 text-[16px]">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all hover:scale-105 text-[16px]">
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Book Modal */}
      {isViewModalOpen && selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 p-4" onClick={handleBackdropClick}>
          <div className="bg-white rounded-2xl w-full max-w-md sm:max-w-lg p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-200 border-t-4 border-blue-500">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 sm:p-4 rounded-t-xl -mt-4 sm:-mt-6 -mx-4 sm:-mx-6 flex justify-between items-center">
              <div className="flex items-center gap-2 sm:gap-3">
                <FaBook className="text-xl sm:text-2xl" />
                <h3 className="text-lg sm:text-xl font-bold">Book Details</h3>
              </div>
              <button onClick={() => setIsViewModalOpen(false)} className="text-white hover:text-gray-200 transition-colors p-1 sm:p-2">
                <FaTimes size={24} />
              </button>
            </div>
            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-gray-800">
              {bookDetails.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Icon className="text-blue-600" />
                  <div>
                    <span className="font-semibold text-xs sm:text-sm">{label}:</span>
                    <p className="text-xs sm:text-sm">{value || 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4 sm:mt-6">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 sm:px-6 sm:py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all hover:scale-105 shadow-md w-full sm:w-auto text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .blur-sm { filter: blur(4px); }
        .scrollbar-thin::-webkit-scrollbar { width: 8px; height: 8px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background-color: #2563eb; border-radius: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background-color: #e5e7eb; border-radius: 4px; }
        .scrollbar-thin { scrollbar-width: thin; scrollbar-color: #2563eb #e5e7eb; }
      `}</style>
    </div>
  );
};

export default LibraryAddNew;