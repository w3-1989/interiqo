import TopBar from "../../components/Shared/TopBar";
import FreelancerMainNav from "../../components/Freelancer/FreelancerMainNav";
import SendClientInvite from "../../components/Freelancer/SendClientInviteForm";
import Background from "../../assets/backgrounds/GeometricBG.svg?react";
import { useState } from "react";
import DisplayBriefs from "../../components/Freelancer/DisplayBriefs";

export default function FreelancerDashboard() {
  const [activePage, setActivePage] = useState(() => {
    const result = localStorage.getItem("freelancer-active-page");
    if (!result) {
      return "invite";
    } else {
      return result;
    }
  });

    function handlePageChange(page: string){
    localStorage.setItem('freelancer-active-page', page) 
    setActivePage(page)
  }

  const views = {
    invite: <SendClientInvite />,
    briefs: <DisplayBriefs />,
    projects: <div>Projects</div>,
    chat: <div>Chat</div>,
    profile: <div>Profile</div>,
    settings: <div>Settings</div>,
  };
  return (
    <>
      <section className=" relative h-screen flex flex-col dark:bg-interiqo-black-500">
        <Background className="absolute  h-screen opacity-20" />
        <TopBar showNotifications={true} />
        {views[activePage as keyof typeof views]}
        <FreelancerMainNav
          setActivePage={handlePageChange}
          activePage={activePage}
        />
      </section>
    </>
  );
}
