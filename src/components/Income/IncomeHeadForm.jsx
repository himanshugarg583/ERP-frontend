import React from "react";

const AddIncomeHead = ()=>{
    return(
        <div className=" flex items-center justify-center mr-4 bg-slate-700  rounded-lg shadow-lg w-full max-w-lg" style={{height:'400px'}} >
            <div className=" text-black p-4" style={{padding:'-10px'}}>
        <h2 className="text-xl font-semibold mb-1 flex items-center">
            <i class="fas fa-edit mr-2"></i>  Add / Edit Income Head
        </h2>

        <form className="">
           
           

           

        

            <div class="mb-1">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="other">
                    Income Head*
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
                <label class="block text-gray-700 text-sm font-bold mb-2" for="attach-document">
                    Description
                </label>
                   <textarea className="w-full p-2 border border-gray-300 rounded mt-1"></textarea>

              
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

export default AddIncomeHead;
