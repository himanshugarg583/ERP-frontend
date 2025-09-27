import React, { useState, useEffect } from 'react';
import OnlineLearningHeader from './OnlineLearningHeader';
import OnlineLearningSidebar from './OnlineLearningSidebar';
import { MdVideocam, MdPlayArrow, MdSchedule, MdGroup, MdLanguage, MdDownload, MdNotifications, MdClose } from 'react-icons/md';

const OnlineLearningLive = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPastClass, setSelectedPastClass] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const classes = [
    {
      subject: "Hindi",
      instructor: { name: "Ms. Anjali Verma", title: "Associate Professor", image: "https://randomuser.me/api/portraits/women/25.jpg" },
      startTime: "09:00 AM",
      endTime: "10:00 AM",
      topic: "Advanced Grammar",
      description: "Covered tenses, sentence structure, and creative writing",
      tags: ["Hindi Grammar", "Language", "Class 9"],
      duration: "60 minutes",
      participants: "42 students attending",
      language: "Hindi/English",
      materials: [{ name: "Chapter 5 Notes.pdf" }, { name: "Practice Worksheet.pdf" }],
      color: "yellow"
    },
    {
      subject: "English",
      instructor: { name: "Mr. David Brown", title: "Associate Professor", image: "https://randomuser.me/api/portraits/men/30.jpg" },
      startTime: "11:00 AM",
      endTime: "12:00 PM",
      topic: "Shakespeare's Sonnets",
      description: "Literary analysis and interpretation",
      tags: ["English", "Literature"],
      duration: "60 minutes",
      participants: "35 students attending",
      language: "English",
      materials: [{ name: "Sonnets.pdf" }],
      color: "blue"
    },
    {
      subject: "Physics",
      instructor: { name: "Dr. Rajesh Kumar", title: "Senior Professor", image: "https://randomuser.me/api/portraits/men/55.jpg" },
      startTime: "4:11 PM",
      endTime: "4:20 PM",
      topic: "Electromagnetic Induction",
      description: "Faraday's and Lenz's laws",
      color: "purple"
    }
  ];

  const parseTime = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':');
    let hours24 = parseInt(hours);
    if (period === 'PM' && hours24 !== 12) hours24 += 12;
    if (period === 'AM' && hours24 === 12) hours24 = 0;
    const date = new Date(currentTime);
    date.setHours(hours24, parseInt(minutes), 0, 0);
    return date;
  };

  const currentClass = classes.find(cls => {
    const start = parseTime(cls.startTime);
    const end = parseTime(cls.endTime);
    return currentTime >= start && currentTime <= end;
  });

  const pastClasses = classes.filter(cls => {
    const end = parseTime(cls.endTime);
    return currentTime > end;
  });

  const upcomingClasses = classes.filter(cls => {
    const start = parseTime(cls.startTime);
    return currentTime < start;
  });

  const renderLiveClass = (cls) => (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="bg-red-100 p-3 rounded-full">
            <MdVideocam className="text-red-600" size={24} />
          </div>
          <div className="ml-4">
            <div className="text-sm text-red-600 font-medium">LIVE NOW</div>
            <h3 className="text-xl font-bold">{cls?.subject} - {cls?.topic}</h3>
          </div>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
          <MdVideocam className="mr-2" size={20} />
          Join Now
        </button>
      </div>
      <div className="flex flex-col md:flex-row border-t border-gray-100 pt-4">
        <div className="w-full md:w-2/3 pr-0 md:pr-6">
          <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden relative mb-4">
            <img 
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80"
              alt="Live class preview" className="w-full h-full object-cover opacity-50"/>
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-4 rounded-full transition-all transform hover:scale-110">
                <MdPlayArrow className="text-4xl text-white" />
              </button>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
              <img 
                src={cls?.instructor?.image ?? "placeholder.jpg"} 
                alt="Instructor" 
                className="h-full w-full object-cover"/>
            </div>
            <div>
              <p className="font-medium">{cls?.instructor?.name ?? "TBD"}</p>
              <p className="text-sm text-gray-600">{cls?.instructor?.title ?? "Instructor"}</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">{cls?.description ?? "Description loading..."}</p>
          <div className="flex flex-wrap gap-2">
            {cls?.tags?.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{tag}</span>
            )) ?? <span>Loading tags...</span>}
          </div>
        </div>
        <div className="w-full md:w-1/3 mt-6 md:mt-0 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-6">
          <h4 className="font-semibold mb-4">Live Class Information</h4>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <MdSchedule className="text-gray-600 mr-2" size={20} />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-gray-600">{cls?.duration ?? "TBD"}</p>
              </div>
            </div>
            <div className="flex items-center mb-2">
              <MdGroup className="text-gray-600 mr-2" size={20} />
              <div>
                <p className="text-sm font-medium">Participants</p>
                <p className="text-sm text-gray-600">{cls?.participants ?? "TBD"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <MdLanguage className="text-gray-600 mr-2" size={20} />
              <div>
                <p className="text-sm font-medium">Language</p>
                <p className="text-sm text-gray-600">{cls?.language ?? "TBD"}</p>
              </div>
            </div>
          </div>
          <h4 className="font-semibold mb-2">Class Materials</h4>
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            {cls?.materials?.map((material, index) => (
              <div key={index} className="flex items-center justify-between hover:bg-gray-100 p-2 rounded cursor-pointer transition-colors">
                <span className="text-sm">{material?.name ?? "Loading..."}</span>
                <MdDownload className="text-primary-600" size={20} />
              </div>
            )) ?? <div>Loading materials...</div>}
          </div>
          
        </div>
      </div>
    </div>
  );

  const renderPastClass = (cls) => (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => setSelectedPastClass(cls)}>
      <div className={`h-32 bg-gradient-to-r from-${cls?.color}-500 to-${cls?.color}-700 relative`}>
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
          <span className={`bg-${cls?.color}-100 text-${cls?.color}-800 text-xs px-2 py-1 rounded font-medium`}>
            {cls?.subject ?? "Subject"}
          </span>
          <h3 className="text-xl font-bold text-white mt-1">{cls?.subject ?? "Loading..."}</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
            <img 
              src={cls?.instructor?.image ?? "placeholder.jpg"} alt="Instructor" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="font-medium">{cls?.instructor?.name ?? "TBD"}</p>
            <p className="text-sm text-gray-600">{cls?.instructor?.title ?? "Instructor"}</p>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-3">
          <div className="mb-2">
            <p className="text-sm font-medium">Today's session</p>
            <p className="text-sm text-gray-600">{cls?.startTime} - {cls?.endTime}</p>
          </div>
          <div className="mt-3">
            <p className="text-sm font-medium">Topic: {cls?.topic ?? "Loading..."}</p>
            <p className="text-sm text-gray-600">Completed: {cls?.description ?? "Description loading..."}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUpcomingClass = (cls) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className={`h-32 bg-gradient-to-r from-${cls?.color}-500 to-${cls?.color}-700 relative`}>
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
          <span className={`bg-${cls?.color}-100 text-${cls?.color}-800 text-xs px-2 py-1 rounded font-medium`}>
            {cls?.subject ?? "Subject"}
          </span>
          <h3 className="text-xl font-bold text-white mt-1">{cls?.subject ?? "Loading..."}</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
            <img src={cls?.instructor?.image ?? "placeholder.jpg"} alt="Instructor" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="font-medium">{cls?.instructor?.name ?? "TBD"}</p>
            <p className="text-sm text-gray-600">{cls?.instructor?.title ?? "Instructor"}</p>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Today's session</p>
              <p className="text-sm text-gray-600">{cls?.startTime} - {cls?.endTime}</p>
            </div>
            <button className={`bg-${cls?.color}-600 hover:bg-${cls?.color}-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center`}>
              <MdNotifications className="mr-1" size={16} />
              Remind
            </button>
          </div>
          <div className="mt-3">
            <p className="text-sm font-medium">Topic: {cls?.topic ?? "Loading..."}</p>
            <p className="text-sm text-gray-600">{cls?.description ?? "Description loading..."}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPastClassPopup = (cls) => (
    <div className="fixed inset-0 bg-transparent backdrop-blur-md bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{cls?.subject} - {cls?.topic}</h3>
          <button onClick={() => setSelectedPastClass(null)} className="text-gray-600 hover:text-gray-800">
            <MdClose size={24} />
          </button>
        </div>
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
              <img src={cls?.instructor?.image ?? "placeholder.jpg"} alt="Instructor" className="h-full w-full object-cover"/>
            </div>
            <div>
              <p className="font-medium">{cls?.instructor?.name ?? "TBD"}</p>
              <p className="text-sm text-gray-600">{cls?.instructor?.title ?? "Instructor"}</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">Completed: {cls?.description ?? "Description loading..."}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {cls?.tags?.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{tag}</span>
            )) ?? <span>Loading tags...</span>}
          </div>
          <h4 className="font-semibold mb-4">Class Information</h4>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <MdSchedule className="text-gray-600 mr-2" size={20} />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-gray-600">{cls?.duration ?? "TBD"}</p>
              </div>
            </div>
            <div className="flex items-center mb-2">
              <MdGroup className="text-gray-600 mr-2" size={20} />
              <div>
                <p className="text-sm font-medium">Participants</p>
                <p className="text-sm text-gray-600">{cls?.participants ?? "TBD"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <MdLanguage className="text-gray-600 mr-2" size={20} />
              <div>
                <p className="text-sm font-medium">Language</p>
                <p className="text-sm text-gray-600">{cls?.language ?? "TBD"}</p>
              </div>
            </div>
          </div>
          <h4 className="font-semibold mb-2">Class Materials</h4>
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            {cls?.materials?.map((material, index) => (
              <div key={index} className="flex items-center justify-between hover:bg-gray-100 p-2 rounded cursor-pointer transition-colors">
                <span className="text-sm">{material?.name ?? "Loading..."}</span>
                <MdDownload className="text-primary-600" size={20} />
              </div>
            )) ?? <div>Loading materials...</div>}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex">
      <div className={`fixed top-0 left-0 w-64 bg-[#EDF2F7] z-50 h-screen transform transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:static md:translate-x-0 md:flex md:flex-col md:w-64 md:min-h-0`}>
        <OnlineLearningSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      <div className="flex-1 flex flex-col h-screen">
        <OnlineLearningHeader setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 p-6 bg-gray-100">
          <section className="mb-8">
            <h1 className="text-2xl font-bold mb-6">Live Classes Today</h1>
            {currentClass ? (
              <>
                <h2 className="text-xl font-bold mb-4">Currently Live</h2>
                {renderLiveClass(currentClass)}
              </>
            ) : null}

            {pastClasses?.length > 0 && (
              <>
                <h2 className="text-xl font-bold mb-4">Completed Classes Today</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {pastClasses.map((cls, index) => renderPastClass(cls))}
                </div>
              </>
            )}

            {upcomingClasses?.length > 0 && (
              <>
                <h2 className="text-xl font-bold mb-4">Upcoming Live Classes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingClasses.map((cls, index) => renderUpcomingClass(cls))}
                </div>
              </>
            )}

            {(!currentClass && pastClasses?.length === 0 && upcomingClasses?.length === 0) && (
              <p className="text-gray-600">No classes scheduled for today.</p>
            )}
          </section>
        </main>
        {selectedPastClass && renderPastClassPopup(selectedPastClass)}
      </div>
    </div>
  );
};

export default OnlineLearningLive;