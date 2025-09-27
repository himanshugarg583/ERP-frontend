import React from "react";

const AddIncome = ()=>{
    return(
        <div className=" flex items-center justify-center mr-4 bg-white  rounded-lg shadow-lg w-full max-w-lg overflow-x-auto " style={{}} >
            <div className=" text-black p-4" style={{padding:'-10px'}}>
        <h2 className="text-xl font-semibold mb-1 flex items-center">
            <i class="fas fa-edit mr-2"></i> Add / Edit Income
        </h2>

        <form className="">
            <div className="mb-1">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="income-head">
                    Income Head*
                </label>
                <select id="income-head" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option> Select </option>
                                    <option value="2" data-amount="20"> Demo (20) </option>
                                    <option value="3" data-amount="100000"> Scholership (100000) </option>
                                    <option value="4" data-amount="10000"> bnm (10000) </option>
                                    <option value="5" data-amount="2200"> test income head nitesh (2200) </option>
                                    <option value="6" data-amount="1234689"> Testings (1234689) </option>
                                    <option value="7" data-amount="10000"> test (10000) </option>
                                    <option value="9" data-amount="1230"> lightng (1230) </option>
                                    <option value="10" data-amount="50000"> picnic (50000) </option>
                                    <option value="11" data-amount="20000"> trip (20000) </option>
                                    <option value="13" data-amount="1230"> tested (1230) </option>
                                    <option value="14" data-amount="200000"> donation (200000) </option>
                                    <option value="15" data-amount="10000"> test2 (10000) </option>
                                    <option value="17" data-amount="50000"> Scholarship (50000) </option>
                                    <option value="18" data-amount="200"> admission form (200) </option>
                                    <option value="19" data-amount="400"> general (400) </option>
                                    <option value="20" data-amount="9000"> exam form (9000) </option>
                                    <option value="21" data-amount="150000"> donetion from govt (150000) </option>
                                    <option value="22" data-amount="25000"> Medical Camp (25000) </option>
                                    <option value="23" data-amount="100"> Registration Form Fee (100) </option>
                                    <option value="24" data-amount="50000"> XYZ - st (50000) </option>
                                    <option value="25" data-amount="50000"> School -Picnic (50000) </option>
                </select>
            </div>
            <div class="mb-1">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="account-type">
                    Account Type
                </label>
                <select id="account-type" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option>Select</option>
                    <option value="1"> Saving's A/C </option>
                                    <option value="2"> Salary </option>
                                    <option value="5"> Current </option>
                                    <option value="6"> Offical Account </option>
                                    <option value="7"> LIC Account </option>
                                    <option value="8"> Salary ACCCOUNT TYPe </option>
                                    <option value="9"> Cash </option>
                                    <option value="10"> Building Construction </option>
                                    <option value="11"> Furniture &amp; Fixtures </option>
                                    <option value="12"> Printing Stationary </option>
                </select>
            </div>

            <div class="mb-1">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="account-name">
                    Account Name
                </label>
                <select id="account-name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option>Select</option>
                    <option value="2"> Salary Account</option>
                                    <option value="5"> Current Account</option>
                                    <option value="6"> Offical Account </option>
                                    <option value="7"> LIC Account </option>
                </select>
            </div>

            <div class="mb-1">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="income-from">
                    Income From*
                </label>
                <select id="account-name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option>Select</option>
                    <option value="2"> Other</option>
                                    <option value="5"> Student</option>
                                    {/* <option value="6"> Offical Account </option> */}
                                    {/* <option value="7"> LIC Account </option> */}
                </select>
                            </div>

            <div class="mb-1">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="other">
                    Other/student Name*
                    <input type="text" className="w-full px-3 py-2 border rounded" value="Name"/>       
                </label>


            </div>

            
            <div class="mb-1">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="amount">
                    Amount *
                </label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="Enter amount" />
                            </div>

            <div class="mb-1">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="date">
                    Date *
                </label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" value="08-01-2025" readOnly />

            </div>
            <div class="mb-1">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="payment-mode">
                    Payment Mode*
                </label>
                <select id="account-name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option>Select</option>
                    <option value="2"> Cash</option>
                                    <option value="5"> Check</option>
                                    <option value="6"> onlion </option>
                                    <option value="7"> Draft </option>
                </select>
            </div>
            <div class="mb-1">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="attach-document">
                    Attach Document
                </label>
                <input type="file" className="w-full p-2 border border-gray-300 rounded mt-1" />
            </div>
            
            <div class="flex items-center justify-between">
                <button class="bg-black text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed" type="button">
                    Save
                </button>
            </div>
        </form>

    </div>

        </div>

    )
}

export default AddIncome;
