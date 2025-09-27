import React, { useState, useEffect } from 'react';
import OnlineLearningHeader from './OnlineLearningHeader';
import OnlineLearningSidebar from './OnlineLearningSidebar';
import { MdVideocam, MdHistoryEdu, MdBiotech, MdCalculate, MdMenuBook } from 'react-icons/md';

const OnlineLearningClass = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [filter, setFilter] = useState('All Courses');
  const [formData, setFormData] = useState({
    category: '', firstName: '', lastName: '', email: '', phone: '', courseInterest: '', comments: ''
  });
  const [liveClasses] = useState([
    { id: 1, title: "Maths Problem Solving", date: new Date("2025-03-25T14:00:00"), instructor: "Mr. Ravi Kumar", joinLink: "https://zoom.us/j/123456789", status: "upcoming" },
    { id: 2, title: "English Grammar Basics", date: new Date("2025-03-23T10:00:00"), instructor: "Ms. Priya Sharma", joinLink: "https://zoom.us/j/987654321", status: "completed" }
  ]);
  const [timeLeft, setTimeLeft] = useState({});
  const [assignments] = useState([
    { id: 1, title: "Hindi Essay Writing", status: "pending", dueDate: "2025-03-26", grade: null, feedback: null },
    { id: 2, title: "Maths Quiz", status: "submitted", dueDate: "2025-03-20", grade: "90%", feedback: "Excellent!" }
  ]);
  const [discussions, setDiscussions] = useState([
    { id: 1, user: "Student1", text: "How to solve quadratic equations?", upvotes: 4, replies: [{ user: "Teacher", text: "Use the quadratic formula..." }] }
  ]);
  const [newDiscussion, setNewDiscussion] = useState("");
  const [subjects, setSubjects] = useState([
    {
      id: 1, category: "Language", name: "Hindi", teacher: "Ms. Anjali Verma", teacherImg: "https://randomuser.me/api/portraits/women/25.jpg",
      nextSession: "Today, 9:00 AM", progress: 75, gradient: "from-blue-500 to-blue-700",
      videoLectures: [
        { id: 1, title: "Hindi Vyakaran", url: "https://example.com/hindi-vyakaran.mp4", uploadDate: "2025-03-20" },
        { id: 2, title: "Kahani Lekhan", url: "https://example.com/kahani-lekhan.mp4", uploadDate: "2025-03-21" },
      ],},
    {
      id: 2, category: "Language", name: "English", teacher: "Mr. David Brown", teacherImg: "https://randomuser.me/api/portraits/men/30.jpg",
      nextSession: "Today, 11:00 AM", progress: 60, gradient: "from-green-500 to-green-700",
      videoLectures: [
        { id: 1, title: "Tenses Basics", url: "https://example.com/tenses-basics.mp4", uploadDate: "2025-03-22" },
      ],},
    {
      id: 3, category: "Mathematics", name: "Maths", teacher: "Mrs. Neha Gupta", teacherImg: "https://randomuser.me/api/portraits/women/40.jpg",
      nextSession: "Tomorrow, 10:00 AM", progress: 80, gradient: "from-purple-500 to-purple-700",
      videoLectures: [
        { id: 1, title: "Algebra Basics", url: "https://example.com/algebra-basics.mp4", uploadDate: "2025-03-20" },
        { id: 2, title: "Geometry Intro", url: "https://example.com/geometry-intro.mp4", uploadDate: "2025-03-21" },
      ],},
  ]);
  const [availableCourses] = useState([
    { id: 1, category: "Social Studies", name: "Indian History & Culture", duration: "2 weeks", price: 0, icon: MdHistoryEdu, gradient: "bg-orange-100", status: "popular" },
    { id: 2, category: "Science", name: "Advanced Biology", duration: "4 weeks", price: 0, icon: MdBiotech, gradient: "bg-blue-100", status: "trending" },
    { id: 3, category: "Mathematics", name: "Calculus Fundamentals", duration: "6 weeks", price: 0, icon: MdCalculate, gradient: "bg-purple-100", status: "upcoming" },
    { id: 4, category: "Language", name: "Advanced English Literature", duration: "8 weeks", price: 0, icon: MdMenuBook, gradient: "bg-green-100", status: "popular" },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const updatedTimeLeft = {};
      liveClasses?.forEach((classItem) => {
        if (classItem?.status === "upcoming") {
          const diff = classItem?.date - now;
          updatedTimeLeft[classItem?.id] = diff > 0 
            ? `${Math.floor(diff / (1000 * 60 * 60 * 24))}d ${Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}h ${Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))}m`
            : "Starting Soon";
        }});
      setTimeLeft(updatedTimeLeft);
    }, 1000);
    return () => clearInterval(timer);
  }, [liveClasses]);

  const handleJoinClass = (joinLink) => joinLink && window.open(joinLink, "_blank");
  const handlePostDiscussion = () => {
    if (newDiscussion?.trim()) {
      setDiscussions(prev => [...(prev ?? []), { id: Date.now(), user: "CurrentUser", text: newDiscussion, upvotes: 0, replies: [] }]);
      setNewDiscussion("");
    }};
  const handleUpvote = (id) => {
    setDiscussions(prev => prev?.map(item => 
      item?.id === id ? { ...item, upvotes: (item?.upvotes ?? 0) + 1 } : item
    ) ?? []);
  };
  const handleDownload = (url, title) => {
    const link = document.createElement("a");
    link.href = url ?? '#';
    link.download = `${title ?? 'video'}.mp4`;
    link.click();
  };

  const handleFilterChange = (newFilter) => setFilter(newFilter ?? 'All Courses');
  
  const filteredCourses = availableCourses?.filter(course => {
    if (filter === "All Courses") return true;
    return course?.status === filter?.toLowerCase();
  }) ?? [];

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e?.target?.name]: e?.target?.value ?? '' }));
  };

  const handleEnrollSubmit = (e) => {
    e?.preventDefault();
    const newSubject = {
      id: Date.now(),
      category: formData?.category ?? '',
      name: formData?.courseInterest || "Custom Course",
      teacher: "TBD",
      teacherImg: "https://randomuser.me/api/portraits/lego/1.jpg",
      nextSession: "TBD",
      progress: 0,
      gradient: "from-gray-500 to-gray-700",
      videoLectures: []
    };
    setSubjects(prev => [...(prev ?? []), newSubject]);
    setFormData({ category: '', firstName: '', lastName: '', email: '', phone: '', courseInterest: '', comments: '' });
  };

  const handleCourseClick = (course) => {
    setSelectedSubject({
      ...course,
      teacher: "TBD",
      teacherImg: "https://randomuser.me/api/portraits/lego/1.jpg",
      nextSession: course?.status === "upcoming" ? "Coming Soon" : "Available Now",
      progress: 0,
      gradient: `from-${course?.gradient?.split('-')[1] ?? 'gray'}-500 to-${course?.gradient?.split('-')[1] ?? 'gray'}-700`,
      videoLectures: []
    });
  };

  return (
    <div className="h-screen flex bg-[#F7FAFC] overflow-hidden">
      <div
        className={`fixed top-0 left-0 w-64 bg-[#EDF2F7] z-50 h-screen transform transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:static md:translate-x-0 md:flex md:flex-col md:w-64 md:min-h-0`}>
        <OnlineLearningSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      <div className="flex-1 flex flex-col h-screen">
        <OnlineLearningHeader setIsSidebarOpen={setIsSidebarOpen} />
        <div className="p-6 flex-1 overflow-y-auto">
          <main className="p-6">
            <section className="mb-8">
              <h1 className="text-2xl font-bold mb-6">My Enrolled Subjects</h1>

              {!selectedSubject ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subjects?.map((subject) => (
                    <div key={subject?.id} onClick={() => setSelectedSubject(subject)}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <div className={`h-32 bg-gradient-to-r ${subject?.gradient ?? 'from-gray-500 to-gray-700'} relative`}>
                        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-medium">{subject?.category ?? 'N/A'}</span>
                          <h3 className="text-xl font-bold text-white mt-1">{subject?.name ?? 'Unnamed'}</h3>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center mb-3">
                          <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                            <img src={subject?.teacherImg ?? 'https://via.placeholder.com/40'} alt="Instructor" className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium">{subject?.teacher ?? 'TBD'}</p>
                            <p className="text-sm text-gray-600">Associate Professor</p>
                          </div>
                        </div>
                        <div className="border-t border-gray-100 pt-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium">Next session</p>
                              <p className="text-sm text-gray-600">{subject?.nextSession ?? 'TBD'}</p>
                            </div>
                            <button className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center">
                              <MdVideocam className="text-sm mr-1" />
                              Join
                            </button>
                          </div>
                          <div className="mt-3">
                            <p className="text-sm font-medium">Progress</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${subject?.progress ?? 0}%` }}></div>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{subject?.progress ?? 0}% completed</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <button onClick={() => setSelectedSubject(null)} className="mb-4 text-[#5A67D8] hover:underline">← Back to Subjects</button>
                  <h3 className="text-lg font-semibold text-[#1A202C]">{selectedSubject?.name ?? 'N/A'}</h3>
                  <p className="text-sm text-[#718096]">Teacher: {selectedSubject?.teacher ?? 'TBD'}</p>
                  <p className="text-sm text-[#718096]">Total Lectures: {selectedSubject?.videoLectures?.length ?? 0}</p>
                  <div className="mt-4 space-y-4">
                    {selectedSubject?.videoLectures?.map((lecture) => (
                      <div key={lecture?.id} className="bg-[#F7FAFC] rounded-lg p-4 shadow-sm flex justify-between items-center">
                        <div>
                          <h4 className="text-md font-medium text-[#1A202C]">{lecture?.title ?? 'Untitled'}</h4>
                          <p className="text-sm text-[#718096]">Uploaded: {lecture?.uploadDate ?? 'N/A'}</p>
                        </div>
                        <button onClick={() => handleDownload(lecture?.url, lecture?.title)} className="bg-[#5A67D8] text-white px-4 py-2 rounded-md hover:bg-[#4C51BF]">Download</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-6">Available Free Courses</h2>
              <div className="border-b border-gray-200 mb-6">
                <div className="flex space-x-4">
                  {['All Courses', 'Trending', 'Popular', 'Upcoming'].map(f => (
                    <button key={f} onClick={() => handleFilterChange(f)}
                      className={`px-4 py-2 ${filter === f ? 'border-b-2 border-primary-500 font-medium' : 'hover:border-b-2 hover:border-primary-500 text-gray-600'} transition-all`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses?.map((course) => (
                  <div key={course?.id} onClick={() => handleCourseClick(course)}
                    className="flex bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer">
                    <div className={`w-1/3 ${course?.gradient ?? 'bg-gray-100'} flex items-center justify-center p-4`}>
                      <course.icon className={`text-5xl text-${course?.gradient?.split('-')[1] ?? 'gray'}-600`} />
                    </div>
                    <div className="w-2/3 p-4">
                      <div className="flex justify-between">
                        <span className={`bg-${course?.gradient?.split('-')[1] ?? 'gray'}-100 text-${course?.gradient?.split('-')[1] ?? 'gray'}-800 text-xs px-2 py-1 rounded`}>{course?.category ?? 'N/A'}</span>
                        <span className="text-sm font-medium text-gray-600">{course?.duration ?? 'N/A'}</span>
                      </div>
                      <h3 className="text-lg font-semibold mt-2">{course?.name ?? 'Unnamed'}</h3>
                      <p className="text-sm text-gray-600 mt-1">{course?.status ?? 'N/A'}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <p className="text-sm font-medium text-green-600">Free</p>
                        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-black">
                  <h2 className="text-xl font-bold">Ready to expand your knowledge?</h2>
                  <p className="mt-2">Fill out this form to enroll in a new free course and start your learning journey today!</p>
                </div>
                <div className="p-6">
                  <form onSubmit={handleEnrollSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Select Course Category</label>
                      <select  name="category"  value={formData?.category ?? ''} 
                        onChange={handleFormChange} 
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all">
                        <option value="">Select a category</option>
                        {['Language', 'Mathematics', 'Science', 'Social Studies', 'Arts & Crafts', 'Computer Science'].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">First Name</label>
                      <input name="firstName" value={formData?.firstName ?? ''} onChange={handleFormChange} type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="Your first name"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Last Name</label>
                      <input name="lastName" value={formData?.lastName ?? ''} onChange={handleFormChange} type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="Your last name"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email Address</label>
                      <input name="email" value={formData?.email ?? ''} onChange={handleFormChange} type="email"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="Your email address"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone Number</label>
                      <input
                        name="phone" value={formData?.phone ?? ''} onChange={handleFormChange} type="tel"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="Your phone number"/>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Specific Course Interest</label>
                      <input
                        name="courseInterest" value={formData?.courseInterest ?? ''} onChange={handleFormChange} type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="Example: Advanced Calculus, Hindi Literature, etc."/>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Additional Comments or Questions</label>
                      <textarea
                        name="comments"
                        value={formData?.comments ?? ''}
                        onChange={handleFormChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all h-24"
                        placeholder="Any specific requirements or questions..."></textarea>
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <button
                        type="submit"
                        className="bg-primary-600 hover:bg-primary-700 text-black px-6 py-2 rounded-lg font-medium transition-colors flex items-center">
                        Submit Enrollment Request
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="bg-[#FFFFFF] rounded-lg shadow-md p-6 md:col-span-2 lg:col-span-3">
                <h2 className="text-xl font-semibold text-[#1A202C] mb-4">Class Discussion Forum</h2>
                <div className="space-y-4">
                  {discussions?.map((discussion) => (
                    <div key={discussion?.id} className="bg-[#F7FAFC] rounded-lg p-4 shadow-sm">
                      <p className="text-sm text-[#1A202C]"><strong>{discussion?.user ?? 'Anonymous'}</strong>: {discussion?.text ?? ''}</p>
                      <div className="flex gap-2 mt-1 text-xs">
                        <button onClick={() => handleUpvote(discussion?.id)} className="text-[#5A67D8] hover:underline">Upvote ({discussion?.upvotes ?? 0})</button>
                      </div>
                      {discussion?.replies?.map((reply, index) => (
                        <p key={index} className="text-sm mt-2 pl-4 border-l-2 border-[#E2E8F0] text-[#718096]"><strong>{reply?.user ?? 'Anonymous'}</strong>: {reply?.text ?? ''}</p>
                      ))}
                    </div>
                  ))}
                  <div className="mt-4">
                    <textarea value={newDiscussion ?? ''} onChange={(e) => setNewDiscussion(e?.target?.value ?? '')} 
                      placeholder="Ask a question or share a doubt..." 
                      className="w-full p-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A67D8] bg-[#F7FAFC]" />
                    <button onClick={handlePostDiscussion} className="mt-2 bg-[#5A67D8] text-white px-4 py-2 rounded-md hover:bg-[#4C51BF]">Post</button>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default OnlineLearningClass;