import type { FreelancerNav } from "../../types/FreelancerNav"
import { Send, FileText, ChartNoAxesGantt, MessagesSquare, User, Settings } from 'lucide-react'
import { useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";



export default function MainNav({setActivePage, activePage}: FreelancerNav){

    const [hoveredItem, setHoveredItem] = useState<string | null>(null)
    const {isDarkMode} = useContext(ThemeContext)


const navItems = [{
  id: 'invite' ,
  tooltip: 'Send Invite',
  svg: Send,
}, {
  id: 'briefs',
  tooltip: 'Briefs',
  svg: FileText,
}, {
  id: 'projects',
  tooltip: 'Projects',
  svg: ChartNoAxesGantt,
}, {
  id: 'chat',
  tooltip: 'Chat',  
  svg: MessagesSquare,
}, {
  id: 'profile',
  tooltip: 'Profile',
  svg: User,
  
}, {
  id:'settings',
  tooltip: 'Settings',
  svg: Settings,
  
}] as const;



    function renderNavItems(){
        return navItems.map((item) =>{
            console.log(activePage, item.id)
            console.log(item.id === activePage)

            const Icon = item.svg
            return (
                <div key={item.id} className=" flex flex-col relative group">
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 invisible group-hover:visible flex flex-col items-center">
                        <span className="flex justify-center bg-tooltip text-white text-xs py-2 px-3 w-[100px] font-DMSans">
                            {item.tooltip}
                        </span>
                        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#4C4C4C]"/>
                    </div>
                     <button 
                     onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => setActivePage(item.id)}
                     style={{ 
                    backgroundColor: item.id === activePage ? '#5805FF' : hoveredItem === item.id ? '#5805FF' : '',
                    transform: item.id === activePage ? 'scale(1.1)' : ''
                    }}
                    className={`group-hover:bg-interiqo-purple-400 transition-transform duration-200
                         ${item.id === activePage ? '' : 'hover:scale-110'} flex min-h-14 min-w-14 
                         cursor-pointer bg-white dark:bg-interiqo-black-400 border
                     border-black/5 justify-center items-center`}
                    >
                        <Icon size={20} color={item.id === activePage || hoveredItem === item.id ? 'white' : isDarkMode ? 'white' : 'black' }/>
                </button>
                </div>
            ) 
        })
    }

    return (
        <>
            <nav className="flex absolute gap-6 bottom-8 left-1/2 -translate-x-1/2  ">{renderNavItems()}</nav>
        </>
    )
}