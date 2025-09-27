import React, { useState, useMemo } from 'react';
import Sidebar from './Parent_Sidebar';
import Header from './Parent_Header';
import {
    FaPhone, FaCreditCard, FaRegCalendarAlt, FaMapMarkerAlt, FaSun, FaMoon, FaInfoCircle,
    FaExclamationTriangle, FaBell, FaClipboardCheck, FaClipboardList, FaUser, FaCog
} from 'react-icons/fa';
import { MdEvent } from 'react-icons/md';
import { GiBus } from 'react-icons/gi';
import { LinearProgress, styled } from '@mui/material';
import Parent_InfoCard from './Parent_InfoCard';
import Parent_ContactCard from './Parent_ContactCard';
import Parent_Notification from './Parent_Notification';
import Parent_Guideline from './Parent_Guideline';

// Custom styled LinearProgress
const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
    '& .MuiLinearProgress-bar': {
        backgroundColor: '#3b82f6',
        borderRadius: 4,
    },
}));

const ParentTransport = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Added sidebar state

    const [transportData, setTransportData] = useState({
        student: {
            name: 'Priya Sharma',
            classSection: 'Class 8-A',
            rollNumber: 'STD2023456',
            location: '12/3 Vasant Vihar, New Delhi',
            routeNumber: 'Route #15 - South Delhi Loop',
        },
        bus: {
            number: 'Bus #DL-1015',
            route: 'South Delhi Route',
            driverName: 'Mr. Ramesh Kumar',
            driverContact: '+91 98765 43210',
            conductorName: 'Ms. Geeta Devi',
            conductorContact: '+91 87654 32109',
        },
        tracking: {
            busNumber: 'Bus #12',
            status: 'On Route',
            progress: 70,
            eta: '3:45 PM',
            timeAway: '10 minutes away',
            arrivalTime: '08:00 AM (in 15 minutes)',
            currentLocation: 'MG Road & Vasant Kunj',
        },
        schedule: {
            pickup: { time: '07:30 AM', location: '12/3 Vasant Vihar (Bus Stop #15)' },
            drop: { time: '02:30 PM', location: '12/3 Vasant Vihar (Bus Stop #15)' },
            days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            note: 'Regular service on school days only. No service on public holidays like Diwali, Holi, and school breaks.',
        },
        fees: {
            monthly: 2500,
            quarterly: 7000,
            yearly: 25000,
            currentPlan: 'Quarterly',
            currentPeriod: 'Jan - Mar 2025',
            nextDueDate: 'April 5, 2025',
            amountDue: 7000,
        },
        notifications: [
            { type: 'info', title: 'Route Delay Notice', message: 'Bus #DL-1015 is running 15 minutes behind schedule this morning due to traffic on Ring Road.', time: 'Today, 7:10 AM', icon: <FaBell className="text-blue-500 text-2xl" />, borderColor: 'border-blue-500' },
            { type: 'warning', title: 'Weather Alert', message: 'Due to heavy rain expected tomorrow, buses may experience delays. Parents will be notified of any changes.', time: 'Today, 2:45 PM', icon: <FaExclamationTriangle className="text-yellow-500 text-2xl" />, borderColor: 'border-yellow-500' },
            { type: 'success', title: 'Bus Arrival Notification', message: 'Bus #DL-1015 has arrived at school safely. All students have been dropped off.', time: 'Today, 8:15 AM', icon: <FaInfoCircle className="text-green-500 text-2xl" />, borderColor: 'border-green-500' },
        ],
    });

    const currentDay = useMemo(() => new Date().getDay(), []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50"> {/* Updated wrapper */}
            <div className="flex w-full">
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} /> {/* Updated Sidebar with props */}
                <main className="flex-1 overflow-y-auto lg:ml-64"> {/* Updated to lg:ml-64 */}
                    <Header setIsSidebarOpen={setIsSidebarOpen} /> {/* Updated Header with prop */}
                    <div id="webcrumbs" className="w-full max-w-7xl mx-auto p-6">
                        <header className="mb-8">
                            <h1 className="text-3xl text-center font-bold mb-2">Student Transport Portal</h1>
                        </header>

                        {/* Student Transport Details */}
                        <section className="mb-8 bg-blue-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Student Transport Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Parent_InfoCard title="Student Name" value={transportData.student.name} />
                                    <Parent_InfoCard title="Class & Section" value={transportData.student.classSection} />
                                    <Parent_InfoCard title="Roll Number / ID" value={transportData.student.rollNumber} />
                                </div>
                                <div>
                                    <Parent_InfoCard title="Pickup & Drop Location" value={transportData.student.location} />
                                    <Parent_InfoCard title="Transport Route Number" value={transportData.student.routeNumber} />
                                </div>
                            </div>
                        </section>

                        {/* Bus & Driver Information */}
                        <section className="mb-8 bg-yellow-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Bus & Driver Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Parent_InfoCard title="Bus Number & Route" value={`${transportData.bus.number} - ${transportData.bus.route}`} />
                                    <Parent_ContactCard role="Driver's Name" name={transportData.bus.driverName} />
                                    <Parent_ContactCard role="Driver's Contact" contact={transportData.bus.driverContact} />
                                </div>
                                <div>
                                    <Parent_ContactCard role="Conductor's Name" name={transportData.bus.conductorName} />
                                    <Parent_ContactCard role="Conductor's Contact" contact={transportData.bus.conductorContact} />
                                </div>
                            </div>
                        </section>

                        {/* Live Bus Tracking */}
                        <section className="mb-8 bg-green-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Live Bus Tracking</h2>
                            <div className="mb-4">
                                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <GiBus className="text-yellow-500 mr-2" />
                                            <span className="font-medium">{transportData.tracking.busNumber}</span>
                                        </div>
                                        <div>
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">{transportData.tracking.status}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="relative pt-1">
                                            <div className="flex mb-2 items-center justify-between">
                                                <div>
                                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-200 text-blue-800">
                                                        {transportData.tracking.timeAway}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-semibold inline-block text-blue-800">
                                                        ETA: {transportData.tracking.eta}
                                                    </span>
                                                </div>
                                            </div>
                                            <CustomLinearProgress variant="determinate" value={transportData.tracking.progress} />
                                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                                <span>School</span>
                                                <span>Current Location</span>
                                                <span>Home</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="flex items-center mb-2">
                                            <MdEvent className="text-blue-500 mr-2" />
                                            <span className="font-medium">Estimated Time of Arrival</span>
                                        </div>
                                        <p className="text-lg font-bold">{transportData.tracking.arrivalTime}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="flex items-center mb-2">
                                            <FaMapMarkerAlt className="text-purple-500 mr-2" />
                                            <span className="font-medium">Current Location</span>
                                        </div>
                                        <p className="text-lg font-medium">{transportData.tracking.currentLocation}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Pickup & Drop Schedule */}
                        <section className="mb-8 bg-purple-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Pickup & Drop Schedule</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center mb-3">
                                        <FaSun className="text-amber-500 text-2xl mr-2" />
                                        <h3 className="text-lg font-semibold">Morning Pickup</h3>
                                    </div>
                                    <div className="ml-9">
                                        <Parent_InfoCard title="Time" value={transportData.schedule.pickup.time} className="mb-2" />
                                        <Parent_InfoCard title="Location" value={transportData.schedule.pickup.location} className="mb-2" />
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center mb-3">
                                        <FaMoon className="text-indigo-500 text-2xl mr-2" />
                                        <h3 className="text-lg font-semibold">Afternoon Drop</h3>
                                    </div>
                                    <div className="ml-9">
                                        <Parent_InfoCard title="Time" value={transportData.schedule.drop.time} className="mb-2" />
                                        <Parent_InfoCard title="Location" value={transportData.schedule.drop.location} className="mb-2" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-3 flex items-center">
                                    <MdEvent className="text-blue-500 mr-2" />
                                    Days of Operation
                                </h3>
                                <div className="grid grid-cols-7 gap-2 text-center">
                                    {transportData.schedule.days.map((day, index) => (
                                        <div
                                            key={day}
                                            className={`py-2 px-3 rounded-lg font-medium ${index === currentDay
                                                ? 'bg-blue-500 text-white shadow-md'
                                                : index !== 0
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-500'
                                                }`}
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-3 text-sm text-gray-600">{transportData.schedule.note}</p>
                            </div>
                        </section>

                        {/* Transport Fees & Payment */}
                        <section className="mb-8 bg-red-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Transport Fees & Payment</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                                    <h3 className="text-lg font-semibold mb-3">Transport Fee Breakdown</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span>Monthly Fee</span>
                                            <span className="font-medium">₹{transportData.fees.monthly.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Quarterly Fee</span>
                                            <span className="font-medium">₹{transportData.fees.quarterly.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Yearly Fee</span>
                                            <span className="font-medium">₹{transportData.fees.yearly.toLocaleString()}</span>
                                        </div>
                                        <div className="border-t pt-2 flex justify-between font-bold">
                                            <span>Current Plan</span>
                                            <span className="text-green-600">{transportData.fees.currentPlan}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                                    <h3 className="text-lg font-semibold mb-3">Payment Status</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <div className="w-2/3">
                                                <span className="text-gray-600 text-sm block">Current Period</span>
                                                <span className="font-medium">{transportData.fees.currentPeriod}</span>
                                            </div>
                                            <div className="w-1/3 text-right">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                    <FaClipboardCheck className="text-sm mr-1" />
                                                    Paid
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-2/3">
                                                <span className="text-gray-600 text-sm block">Next Due Date</span>
                                                <span className="font-medium">{transportData.fees.nextDueDate}</span>
                                            </div>
                                            <div className="w-1/3 text-right">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                                    <FaClipboardList className="text-sm mr-1" />
                                                    Upcoming
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-2/3">
                                                <span className="text-gray-600 text-sm block">Amount Due</span>
                                                <span className="font-medium">₹{transportData.fees.amountDue.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Notifications & Alerts */}
                        <section className="mb-8 bg-amber-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Notifications & Alerts</h2>
                            <div className="space-y-4">
                                {transportData.notifications.map((notification, idx) => (
                                    <Parent_Notification
                                        key={idx}
                                        type={notification.type}
                                        title={notification.title}
                                        message={notification.message}
                                        time={notification.time}
                                        icon={notification.icon}
                                        borderColor={notification.borderColor}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Transport Rules & Guidelines */}
                        <section className="bg-blue-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Transport Rules & Guidelines</h2>
                            <div className="space-y-4">
                                <Parent_Guideline
                                    title="School Transport Safety Guidelines"
                                    icon={<FaClipboardCheck className="text-red-500 mr-2" />}
                                    content={
                                        <ul className="list-disc space-y-2 text-gray-700">
                                            <li>Students must always wear seatbelts when provided in the bus.</li>
                                            <li>Students must remain seated while the bus is in motion.</li>
                                            <li>No shouting, fighting, or disruptive behavior is allowed on the bus.</li>
                                            <li>Students should arrive at the pickup point 5 minutes before scheduled pickup time.</li>
                                            <li>Food and drinks are not allowed to be consumed on the bus.</li>
                                        </ul>
                                    }
                                />
                                <Parent_Guideline
                                    title="Rules for Pickup & Drop"
                                    icon={<FaClipboardList className="text-blue-500 mr-2" />}
                                    content={
                                        <ul className="list-disc space-y-2 text-gray-700">
                                            <li>A parent/guardian must be present at the drop-off point for students in Class 5 and below.</li>
                                            <li>If the designated adult is not present, the student will be returned to school.</li>
                                            <li>Any change in pickup/drop location must be communicated to the school at least 24 hours in advance.</li>
                                            <li>In case of absence, please notify the transportation department by 6:00 AM.</li>
                                            <li>Students should be ready 5 minutes before the scheduled pickup time.</li>
                                        </ul>
                                    }
                                />
                                <Parent_Guideline
                                    title="Parental Responsibilities & Contact Protocol"
                                    icon={<FaUser className="text-purple-500 mr-2" />}
                                    content={
                                        <>
                                            <ul className="list-disc space-y-2 text-gray-700">
                                                <li>Parents are responsible for ensuring their child reaches the pickup point on time.</li>
                                                <li>Parents must update contact information with the school immediately if it changes.</li>
                                                <li>For emergencies during transit, contact the bus driver or conductor directly.</li>
                                                <li>For scheduling changes or general inquiries, contact the Transportation Office at +91 87654 32109.</li>
                                                <li>Parents should review the transport rules with their children regularly.</li>
                                            </ul>
                                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                                <h4 className="font-medium mb-2">Emergency Contact Information</h4>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <span className="text-gray-600 text-sm">Transportation Office</span>
                                                        <div className="flex items-center">
                                                            <span className="font-medium">+91 87654 32109</span>
                                                            <button className="ml-2 text-blue-500 hover:text-blue-700 transition-colors">
                                                                <FaClipboardCheck />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600 text-sm">School Reception</span>
                                                        <div className="flex items-center">
                                                            <span className="font-medium">+91 98765 43210</span>
                                                            <button className="ml-2 text-blue-500 hover:text-blue-700 transition-colors">
                                                                <FaClipboardCheck />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    }
                                />
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ParentTransport;