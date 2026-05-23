import type { FreelancerNavProps } from "../../types/FreelancerNav";
import { Send, FileText, ChartNoAxesGantt, MessagesSquare, User, Settings } from 'lucide-react'

import MainNav from "../Shared/MainNav";


export default function FreelancerMainNav({setActivePage, activePage}: FreelancerNavProps){



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



    return (
          <MainNav navItems={navItems} activePage={activePage} setActivePage={setActivePage}/>
      )
}