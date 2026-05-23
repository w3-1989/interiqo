import TopBar from "../../components/Shared/TopBar"
import FreelancerMainNav from "../../components/Freelancer/FreelancerMainNav"
import SendClientInvite from "../../components/Freelancer/SendClientInviteForm"
import Background from "../../assets/backgrounds/GeometricBG.svg?react"
import { useState } from "react"

export default function FreelancerDashboard(){
const [activePage, setActivePage] = useState<string>('invite')
    
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
        <TopBar showNotifications={true}/>
        {views[activePage as keyof typeof views]}
        <FreelancerMainNav
        setActivePage = {setActivePage} 
        activePage={activePage}/>
        </section>
        </>
    )
}