import React from 'react'
import Profileinfo from '../cards/profileinfo'
import { useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar'
import travellogo from '../../assets/images/travellinlogo.png'

const Navbar = ({userinfo,searchQuery,setSearchQuery, onsearchnote,handleclearsearch}) => {
const istoken=localStorage.getItem('token')
    const navigate=useNavigate()

  const  onLogout=()=>{
localStorage.clear();
navigate("/login")
    }

    const handleSearch=()=>{
      if (searchQuery) {
        onsearchnote(searchQuery)
      }
    }

    const onClearSerach=()=>{
handleclearsearch();
setSearchQuery("");
    }

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10'>
        <img src={travellogo} alt="travel story" className='h-9'/>
       {istoken && <>
       <SearchBar value={searchQuery} onChange={({target})=>{
        setSearchQuery(target.value)
       }}
       handleSearch={handleSearch}
       onClearSerach={onClearSerach} />
       <  Profileinfo userinfo={userinfo} onLogout={onLogout}/>
       {""}
       </>}
    </div>
  )
}

export default Navbar