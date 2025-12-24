import react from 'react';

const PageHeader =({pageheading,Subheading})=>{
    return(
        <div class="flex justify-between items-center   w-full m-auto"> 
           <h1 class="text-2xl font-semibold flex items-center text-black">
        <i class="fas fa-file-alt mr-2"></i> {Subheading}
    </h1>
    <div class="flex items-center gap-2">
      <p className=' text-black'>{pageheading}
      </p>
             <p className=' text-black'>/</p>
             <p className='text-black'> {Subheading}
      </p>

    </div>
            </div>
    );
}

export default PageHeader;