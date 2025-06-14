import moment from 'moment'
import React from 'react'
import { MdOutlineClose } from 'react-icons/md';

const FilterInfoTitle = ({filterDates,onClear,filter}) => {
    const DateRangeChip=({date})=>{
        const startdate=date?.from ? moment(date?.from).format("Do MMM YYYY"):"N/A";

        const enddate=date?.to ? moment(date?.to).format("Do MMM YYYY"):"N/A";
        return(
            <div className='flex items-center gap-2 bg-slate-100 px-3 py-2 rounded' >
                <p className='text-xs font-medium'>
                    {startdate}-{enddate}
                </p>
                <button onClick={onClear} >
                    <MdOutlineClose/>
                </button>
            </div>
        )
    }
  return (filter &&
    (<div className='mb-5'>
        {filter==="search"?(<h3 className='text-lg font-medium' >Search Results</h3>):(
         < div className='flex items-center gap-2'>
            <h3  className='text-lg font-medium'>Travel Stories from</h3>
            <DateRangeChip date={filterDates} />
            </div>
        )}
    </div>)
  )
}

export default FilterInfoTitle