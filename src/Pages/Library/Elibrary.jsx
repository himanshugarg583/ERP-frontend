import React from 'react';
import LibraryNavbar from './LibraryNavbar';
import LibrarySidebar from './LibrarySidebar';
import { jsPDF } from "jspdf";

const ELibrary = () => {
  // Sample e-book data
  const books = [
    {
      bookId: "B001",
      isbn: "978-0-7475-3269-9",
      title: "Harry Potter",
      author: "J.K. Rowling",
      genre: "Fantasy",
      edition: "1st",
      download: "Download",
      action: "View",
      pdfContent: "This is a sample PDF content for Harry Potter book..."
    },
    {
      bookId: "B002",
      isbn: "978-0-0623-1325-6",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      genre: "Fiction",
      edition: "2nd",
      download: "Download",
      action: "View",
      pdfContent: "This is a sample PDF content for To Kill a Mockingbird..."
    },
    {
      bookId: "B003",
      isbn: "978-0-141-1850-6",
      title: "1984",
      author: "George Orwell",
      genre: "Dystopian",
      edition: "3rd",
      download: "Download",
      action: "View",
      pdfContent: "This is a sample PDF content for 1984..."
    }
  ];

  // Function to handle PDF download
  const handleDownload = (book) => {
    const doc = new jsPDF();
    doc.text(book?.pdfContent, 10, 10);
    doc.save(`${book?.title}.pdf`);
  };

  // Function to handle PDF view
  const handleView = (book) => {
    const doc = new jsPDF();
    doc.text(book?.pdfContent, 10, 10);
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex font-sans">
      {/* Navbar */}
      <div className="fixed top-0 left-0 sm:left-16 md:left-64 right-0 z-20 bg-white shadow-md">
        <LibraryNavbar />
      </div>

      <div className="flex flex-1 pt-16 bg-gray-100">
        {/* Sidebar */}
        <div className="hidden md:block fixed top-0 left-0 w-64 h-full bg-gray-800 text-white shadow-md z-20">
          <LibrarySidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-6 overflow-x-auto bg-gray-100">
          <div className="max-w-7xl mx-auto md:max-w-none md:mx-0">
            {/* Main Heading */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">E-Library Books</h1>
            </div>

            {/* Table Content */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto hide-scrollbar">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      {[
                        'BOOK ID',
                        'ISBN',
                        'TITLE',
                        'AUTHOR',
                        'GENRE',
                        'EDITION',
                        'DOWNLOAD',
                        'ACTION',
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider border border-gray-300 whitespace-nowrap"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {books?.map((book, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 border border-gray-300">
                          {book?.bookId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 border border-gray-300">
                          {book?.isbn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">
                          {book?.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">
                          {book?.author}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 border border-gray-300">
                          {book?.genre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 border border-gray-300">
                          {book?.edition}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 border border-gray-300">
                          <button
                            onClick={() => handleDownload(book)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Download PDF
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 border border-gray-300">
                          <button
                            onClick={() => handleView(book)}
                            className="text-green-600 hover:text-green-800 font-medium"
                          >
                            View PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Custom CSS to hide scrollbar */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, and Opera */
        }
      `}</style>
    </div>
  );
};

export default ELibrary;