import TopBar from "../../components/Shared/TopBar"
import ClientMainNav from "../../components/Client/ClientMainNav"
import Background from "../../assets/backgrounds/GeometricBG.svg?react"
import { useState } from "react"

export default function ClientDashboard(){
    const [activePage, setActivePage ] = useState(() => {
        const result = localStorage.getItem("client-active-page")
        if(!result){
            return'home'
        } else {
            return result
        }
    })

    function handlePageChange(page: string){
        localStorage.setItem("client-active-page", page)
        setActivePage(page)
    }
    
    const views = {
        home: <div>Home</div>,
        briefs: <div>Briefs</div>,
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
        <ClientMainNav
        setActivePage = {handlePageChange} 
        activePage={activePage}/>
        </section>
        </>
    )
}