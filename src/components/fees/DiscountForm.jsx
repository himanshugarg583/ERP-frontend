import React from "react";

const FeeDiscountForm = ({formheading})=>{
    return(
        <div className=" flex  justify-center mr-4 bg-white  rounded-lg shadow-lg w-full max-w-lg" style={{height:'auto'}} >
            <div className=" text-black p-4" style={{padding:'-10px'}}>
        <h2 className="text-xl font-semibold mb-1 flex items-center">
            <i className="fas fa-edit mr-2"></i>  {formheading}
        </h2>

        <form className="">
            <div className="mb-1">
                <label className="block text-black text-sm font-bold mb-2" htmlFor="other">
                Fees Type *
                    <input type="text" className="w-full px-3 py-2 border rounded" defaultValue="Name"/>       
                </label>
            </div>

            <div className="mb-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                Name *
                </label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="Enter amount" />
            </div>
                           
            <div className="mb-1">
                <label className="block text-black text-sm font-bold mb-2" htmlFor="other">
                Discount Type *
                </label>
                <select className='w-full p-2 border border-gray-300 rounded mt-1'>
                    <option>Select</option>
                    <option>Percentage</option>
                    <option>Amount</option>
                </select>
            </div>

            <div className="mb-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                Amount *
                </label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="Enter amount" />
            </div>

            <div className="mb-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="attach-document">
                    Description
                </label>
                <textarea className="w-full p-2 border border-gray-300 rounded mt-1"></textarea>
            </div>
            
            <div className="flex items-center justify-between">
                <button className="bg-black text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed" type="button">
                    Save
                </button>
            </div>
        </form>
    </div>
        </div>
    )
}

const CheckForm = ({checkheading})=>{
    return(
        <div className=" flex  justify-center mr-4 bg-white  rounded-lg shadow-lg w-full max-w-lg" style={{height:'auto'}} >
            <div className=" text-black p-4" style={{padding:'-10px'}}>
        <h2 className="text-xl font-semibold mb-1 flex items-center">
            <i className="fas fa-edit mr-2"></i>  {checkheading}
        </h2>

        <form className="">
            <div className="mb-1">
                <label className="block text-black text-sm font-bold mb-2" htmlFor="other">
                Fees Type *
                    <input type="text" className="w-full px-3 py-2 border rounded" defaultValue="Name"/>       
                </label>
            </div>

            <div className="mb-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                Name *
                </label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="Enter amount" />
            </div>
                           
            <div className="mb-1">
                <label className="block text-black text-sm font-bold mb-2" htmlFor="other">
                Discount Type *
                </label>
                <select className='w-full p-2 border border-gray-300 rounded mt-1'>
                    <option>Select</option>
                    <option>Percentage</option>
                    <option>Amount</option>
                </select>
            </div>

            <div className="mb-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                Amount *
                </label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="Enter amount" />
            </div>

            <div className="mb-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="attach-document">
                    Description
                </label>
                <textarea className="w-full p-2 border border-gray-300 rounded mt-1"></textarea>
            </div>
            
            <div className="flex items-center justify-between">
                <button className="bg-black text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed" type="button">
                    Save
                </button>
            </div>
        </form>
    </div>
        </div>
    )
}

const CheQueForm = ({chequeheading})=>{
    return(
        <div className=" flex  justify-center mr-4 bg-white  rounded-lg shadow-lg w-full max-w-lg" style={{height:'auto'}} >
            <div className=" text-black p-4" style={{padding:'-10px'}}>
        <h2 className="text-xl font-semibold mb-1 flex items-center">
            <i className="fas fa-edit mr-2"></i>  {chequeheading}
        </h2>

        <form className="">
            <div className="mb-1">
                <label className="block text-black text-sm font-bold mb-2" htmlFor="other">
                Student *
                <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="Enter amount" />       
                </label>
            </div>

            <div className="mb-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                Cheque No *
                </label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="Enter amount" />
            </div>
                           
            <div className="mb-1">
                <label className="block text-black text-sm font-bold mb-2" htmlFor="other">
                Bank Name *
                <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="Enter amount" />
                </label>
            </div>

            <div className="mb-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                Amount *
                </label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="Enter amount" />
            </div>

            <div className="mb-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                Date *
                </label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="Enter amount" />
            </div>

            <div className="mb-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                Status *
                </label>
                <select className='w-full p-2 border border-gray-300 rounded mt-1'>
                    <option>Select</option>
                    <option>Collected</option>
                    <option>Deposited</option>
                    <option>Cleared</option>
                    <option>Bounced</option>
                    <option>Cancelled</option>
                </select>
            </div>
            
            <div className="flex items-center justify-between">
                <button className="bg-black text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed" type="button">
                    Save
                </button>
            </div>
        </form>
    </div>
        </div>
    )
}

const AddClassForm =()=>{
    return(
<div className="bg-gray-100 flex  min-h-screen">
<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
            <i className="fas fa-edit mr-2"></i> Add / Edit Class
        </h2>
        <form>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sr-no">
                    Sr. No <span className="text-red-500">*</span>
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="sr-no" type="text" defaultValue="504" readOnly/>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="group-name">
                    Group Name
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="group-name" type="text" placeholder="Enter Group Name"/>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="class">
                    Class <span className="text-red-500">*</span>
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="class" type="text" placeholder="Enter class"/>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="section">
                    Section <span className="text-red-500">*</span>
                </label>
                <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="section" defaultValue="">
                    <option value="" disabled>Select section</option>
                </select>
            </div>
            <div className="flex items-center justify-end">
                <button className="bg-purple-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                    Save
                </button>
            </div>
        </form>
    </div>
    </div>
    )
}

const AddTeacherForm=()=>{
    return(
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Create Teacher</h1>
        <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                    <input type="email" id="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Email"/>
                </div>

                <div>
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                    <input type="text" id="first-name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="First Name"/>
                </div>

                <div>
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                    <input type="text" id="last-name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Last Name"/>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
                    <div className="mt-2 flex items-center">
                        <input type="radio" id="male" name="gender" className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"/>
                        <label htmlFor="male" className="ml-2 block text-sm font-medium text-gray-700">Male</label>
                        <input type="radio" id="female" name="gender" className="ml-6 h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"/>
                        <label htmlFor="female" className="ml-2 block text-sm font-medium text-gray-700">Female</label>
                    </div>
                </div>

                <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile <span className="text-red-500">*</span></label>
                    <input type="text" id="mobile" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Mobile"/>
                </div>

                <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth <span className="text-red-500">*</span></label>
                    <input type="date" id="dob" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Date of Birth"/>
                </div>
                
                <div>
                    <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">Qualification <span className="text-red-500">*</span></label>
                    <input type="text" id="qualification" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Qualification"/>
                </div>
              
                <div>
                    <label htmlFor="current-address" className="block text-sm font-medium text-gray-700">Current Address <span className="text-red-500">*</span></label>
                    <input type="text" id="current-address" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Current Address"/>
                </div>
  
                <div>
                    <label htmlFor="permanent-address" className="block text-sm font-medium text-gray-700">Permanent Address <span className="text-red-500">*</span></label>
                    <input type="text" id="permanent-address" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Permanent Address"/>
                </div>
           
                <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary <span className="text-red-500">*</span></label>
                    <input type="text" id="salary" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Salary"/>
                </div>
            
                <div>
                    <label htmlFor="joining-date" className="block text-sm font-medium text-gray-700">Joining Date</label>
                    <input type="date" id="joining-date" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Joining Date"/>
                </div>
           
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image <span className="text-red-500">*</span></label>
                    <div className="mt-1 flex items-center">
                        <input type="text" id="image" className="block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Image"/>
                        <button type="button" className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-md">Upload</button>
                    </div>
                </div>
            
                <div>
                    <label className="block text-sm font-medium text-gray-700">Status <span className="text-red-500">*</span></label>
                    <div className="mt-2 flex items-center">
                        <input type="radio" id="active" name="status" className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"/>
                        <label htmlFor="active" className="ml-2 block text-sm font-medium text-gray-700">Active</label>
                        <input type="radio" id="inactive" name="status" className="ml-6 h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"/>
                        <label htmlFor="inactive" className="ml-2 block text-sm font-medium text-gray-700">Inactive</label>
                    </div>
                    <p className="mt-2 text-sm text-red-500">Note: - Activating this will consider in your current subscription cycle</p>
                </div>
            </div>
        </form>
    </div>
    );
}

const AddSubject=()=>{
    return(
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
        <h2 className="text-2xl font-semibold mb-4">Create Subject</h2>
        <p className="text-red-500 mb-4">Note: Subject Name, Code & Type should be Unique for Medium</p>
        
        <form>
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Medium *</label>
                <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                        <input type="radio" className="form-radio text-purple-600" name="medium" value="arabic"/>
                        <span className="ml-2">Arabic</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input type="radio" className="form-radio text-purple-600" name="medium" value="chinese"/>
                        <span className="ml-2">Chinese</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input type="radio" className="form-radio text-purple-600" name="medium" value="french"/>
                        <span className="ml-2">French</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input type="radio" className="form-radio text-purple-600" name="medium" value="spanish"/>
                        <span className="ml-2">Spanish</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input type="radio" className="form-radio text-purple-600" name="medium" value="gujarati"/>
                        <span className="ml-2">Gujarati</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input type="radio" className="form-radio text-purple-600" name="medium" value="english"/>
                        <span className="ml-2">English</span>
                    </label>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Name *</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Name"/>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Type *</label>
                <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                        <input type="radio" className="form-radio text-purple-600" name="type" value="theory"/>
                        <span className="ml-2">Theory</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input type="radio" className="form-radio text-purple-600" name="type" value="practical"/>
                        <span className="ml-2">Practical</span>
                    </label>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Subject Code</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Subject Code"/>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Background Color *</label>
                <div className="flex items-center">
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Background Color"/>
                    <div className="w-8 h-8 ml-2 bg-black border border-gray-300 rounded-md"></div>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Image *</label>
                <div className="flex items-center">
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Image"/>
                    <button className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md">Upload</button>
                </div>
            </div>

            <div className="flex justify-end space-x-4">
                <button type="reset" className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">Reset</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Submit</button>
            </div>
        </form>
        </div>
);
}

const AddContent=()=>{
    return(
        <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
            <i className="fas fa-edit text-purple-700 mr-2"></i>
            <h2 className="text-xl font-semibold text-gray-800">Add Content</h2>
        </div>
        <form>
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1" htmlFor="content-title">Content Title <span className="text-red-500">*</span></label>
                <input type="text" id="content-title" className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600" required />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1" htmlFor="content-type">Content Type <span className="text-red-500">*</span></label>
                <select id="content-type" className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600" required>
                    <option value="">Select</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">Available For <span className="text-red-500">*</span></label>
                <div className="flex items-center mb-2">
                    <input type="checkbox" id="all-staff-teacher" className="mr-2"/>
                    <label htmlFor="all-staff-teacher" className="text-gray-700">All staff Teacher</label>
                </div>
                <div className="flex items-center mb-2">
                    <input type="checkbox" id="student" className="mr-2"/>
                    <label htmlFor="student" className="text-gray-700">Student</label>
                </div>
                <div className="flex items-center">
                    <input type="checkbox" id="subject" className="mr-2"/>
                    <label htmlFor="subject" className="text-gray-700">Subject</label>
                </div>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1" htmlFor="upload-date">Upload Date <span className="text-red-500">*</span></label>
                <input type="text" id="upload-date" className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500" defaultValue="29-01-2025" readOnly/>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1" htmlFor="description">Description</label>
                <textarea id="description" className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"></textarea>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1" htmlFor="privacy">Privacy</label>
                <select id="privacy" className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
                    <option value="view-download">View and Download</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1" htmlFor="content-file">Content File</label>
                <input type="file" id="content-file" className="w-full border border-gray-300 rounded-md p-2"/>
            </div>
            <div className="flex justify-between">
                <button type="button" className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600">Save</button>
                <button type="button" className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600">Save and Duplicate Details</button>
            </div>
        </form>
    </div>
    );
}

export {FeeDiscountForm,CheckForm,CheQueForm,AddClassForm,AddTeacherForm,AddSubject,AddContent};
