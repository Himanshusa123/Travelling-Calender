import nosearch from '../assets/images/no-results.png'
import nofiletr from '../assets/images/filter.png'
import emptyimg from '../assets/images/empty.png'

export const validateEmail=(email)=>{
    const regex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export const getinitial=(name)=>{
    if (!name) {
        return""
    }
    const words=name.split(" ");
    let initials="";
    for (let i = 0;i < Math.min(words.length,2);i++) {
        initials+=words[i][0];
        
    }
    return initials.toUpperCase();
};

export const getemptycardmessage=(filter)=>{
    switch(filter){
        case "search":return `Oops! No stories found matching your search.`;
        case "date":return `No Stories found in the given date range`;
        default: return `Start creating your first Travel story! Click the 'Add' button to jot down your thought, ideas, and memories. Let's get started!`;
    }
}

export const getemptyimg=(filter)=>{
    switch(filter){
        case"search": return nosearch;
        case"date":return nofiletr ;
        default :return  emptyimg;
    }
}