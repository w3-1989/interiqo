import TopBar from "../../components/Shared/TopBar"
import MainNav from "../../components/Freelancer/MainNav"
import SendClientInvite from "../../components/Freelancer/SendClientInviteForm"
import Background from "../../assets/backgrounds/GeometricBG.svg?react"
import { useState } from "react"

export default function FreelancerDashboard(){
    const [activePage, setActivePage ] = useState<'invite' | 'briefs' | 'projects' | 'chat' | 'profile' | 'settings'>('invite')
    
    const views = {
        invite: <SendClientInvite />,
        briefs: <div>Briefs</div>,
        projects: <div>Projects</div>,
        chat: <div>Chat</div>,
        profile: <div>Profile</div>,
        settings: <div>Settings</div>,
        }
    return(
        <>
        <section className=" relative h-screen flex flex-col dark:bg-interiqo-black-500">
        <Background className="absolute  h-screen opacity-20"/>
        <TopBar/>
        {views[activePage]}
        <MainNav
        setActivePage = {setActivePage} 
        activePage={activePage}/>
        </section>
        </>
    )
}