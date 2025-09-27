import React from 'react';
import LibraryNavbar from './LibraryNavbar';
import LibrarySidebar from './LibrarySidebar';

const LibraryViewAll = () => {
  const books = [
    {
      isbn: '978-0-7475-3269-9',
      bookId: 'B001',
      title: "Harry Potter and the Philosopher's Stone",
      author: 'J.K. Rowling',
      genre: 'Fantasy',
      publisherName: 'Bloomsbury',
      publisherYear: '1997',
      edition: '1st',
      shelf: 'A-12',
      status: { totalCopies: 5, issued: 2, available: 3 },
    },
    {
      isbn: '978-0-0623-1555-7',
      bookId: 'B002',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      genre: 'Fiction',
      publisherName: 'J.B. Lippincott & Co.',
      publisherYear: '1960',
      edition: '2nd',
      shelf: 'B-05',
      status: { totalCopies: 8, issued: 4, available: 4 },
    },
    {
      isbn: '978-1-5661-9269-9',
      bookId: 'B003',
      title: '1984',
      author: 'George Orwell',
      genre: 'Dystopian',
      publisherName: 'Secker & Warburg',
      publisherYear: '1949',
      edition: '3rd',
      shelf: 'C-08',
      status: { totalCopies: 6, issued: 1, available: 5 },
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen flex font-sans overflow-x-hidden">
      <div className="fixed top-0 left-0 right-0 md:left-64 z-10 bg-white shadow-md">
        <LibraryNavbar />
      </div>

      <div className="flex flex-1 flex-col md:flex-row pt-16">
        <div className="hidden md:block fixed top-16 left-0 w-64 h-full bg-white shadow-md">
          <LibrarySidebar />
        </div>

        <main className="flex-1 md:ml-64 p-2 sm:p-4 md:p-6 overflow-x-hidden">
          <div className="max-w-full mx-auto">
            {/* Main Heading */}
            <div className="mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Library Books</h1>
            </div>

            {/* Table Content */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full border-collapse border border-gray-300 min-w-[900px]">
                  <thead className="bg-gray-200">
                    <tr>
                      {[
                        'ISBN',
                        'BOOK ID',
                        'TITLE',
                        'AUTHOR',
                        'GENRE',
                        'PUBLISHER NAME',
                        'PUBLISHER YEAR',
                        'EDITION',
                        'SHELF',
                        'STATUS',
                      ].map((header) => (
                        <th
                          key={header}
                          className={`px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-800 uppercase tracking-wider border border-gray-300 ${
                            header === 'PUBLISHER NAME' ||
                            header === 'PUBLISHER YEAR' ||
                            header === 'EDITION' ||
                            header === 'SHELF'
                              ? 'hidden lg:table-cell'
                              : 'whitespace-nowrap'
                          }`}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {books?.length === 0 ? (
                      <tr>
                        <td
                          colSpan="10"
                          className="px-2 sm:px-4 md:px-6 py-8 sm:py-10 md:py-12 text-center text-gray-500 border border-gray-300 text-xs sm:text-sm"
                        >
                          <div className="flex flex-col items-center">
                            <p>No books found.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      books?.map((book, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 text-[10px] sm:text-xs md:text-sm text-gray-600 border border-gray-300 min-w-[120px]">
                            {book?.isbn || '-'}
                          </td>
                          <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 text-[10px] sm:text-xs md:text-sm text-gray-600 border border-gray-300 min-w-[60px]">
                            {book?.bookId || '-'}
                          </td>
                          <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 text-[10px] sm:text-xs md:text-sm text-gray-900 border border-gray-300 min-w-[200px]">
                            {book?.title || '-'}
                          </td>
                          <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 text-[10px] sm:text-xs md:text-sm text-gray-900 border border-gray-300 min-w-[120px]">
                            {book?.author || '-'}
                          </td>
                          <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 text-[10px] sm:text-xs md:text-sm text-gray-600 border border-gray-300 min-w-[80px]">
                            {book?.genre || '-'}
                          </td>
                          <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 text-[10px] sm:text-xs md:text-sm text-gray-600 border border-gray-300 hidden lg:table-cell min-w-[120px]">
                            {book?.publisherName || '-'}
                          </td>
                          <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 text-[10px] sm:text-xs md:text-sm text-gray-600 border border-gray-300 hidden lg:table-cell min-w-[80px]">
                            {book?.publisherYear || '-'}
                          </td>
                          <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 text-[10px] sm:text-xs md:text-sm text-gray-600 border border-gray-300 hidden lg:table-cell min-w-[60px]">
                            {book?.edition || '-'}
                          </td>
                          <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 text-[10px] sm:text-xs md:text-sm text-gray-600 border border-gray-300 hidden lg:table-cell min-w-[60px]">
                            {book?.shelf || '-'}
                          </td>
                          <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 text-[10px] sm:text-xs md:text-sm text-gray-600 border border-gray-300 min-w-[100px]">
                            <div className="flex flex-col">
                              <span>Total: {book?.status?.totalCopies || 0}</span>
                              <span>Issued: {book?.status?.issued || 0}</span>
                              <span>Available: {book?.status?.available || 0}</span>
                            </div>
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

      {/* Custom CSS for invisible but functional scrollbar */}
      <style jsx>{`
        .custom-scrollbar {
          overflow-x: auto;
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: transparent;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default LibraryViewAll;