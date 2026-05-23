import type { ClientNavProps } from "../../types/ClientNav";
import {  FileText, House, MessagesSquare, User, Settings } from 'lucide-react'
import MainNav from "../Shared/MainNav";




export default function ClientMainNav({setActivePage, activePage}: ClientNavProps){

  


const navItems = [{
  id: 'home' ,
  tooltip: 'Home',
  svg: House,
}, {
  id: 'briefs',
  tooltip: 'Briefs',
  svg: FileText,
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