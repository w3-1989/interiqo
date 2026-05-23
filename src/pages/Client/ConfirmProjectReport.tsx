/*
Future fix - currently fetches the first conversation found for this client.
When multi-project support is added, the conversation_id should be passed
as a URL param from DiscoveryChat to ensure the correct conversation brief
is generated and stored.
*/

import Background from "../../assets/backgrounds/GeometricBG.svg?react";
import BriefContent from "../../components/Client/BriefContent";
import TopBar from "../../components/Shared/TopBar";
import BriefSideBar from "../../components/Client/BriefSidebar";
import useBrief from "../../hooks/useBrief";

export default function ConfirmProjectReport() {

    const {title, brief, setBrief} = useBrief()

  return (
    <>
      <div className="h-screen flex flex-col dark:bg-interiqo-black-500 ">
        <Background className="absolute h-screen opacity-20" />
        <TopBar />
        <section className=" flex justify-center align-middle items-center max-w-[1088px] h-[640px] w-full mx-auto shadow-[0_4px_120px_30px_rgba(88,5,255,0.1)] dark:shadow-[0_4px_120px_30px_rgba(88,5,255,0.2)]  ">
          <div className="z-2 w-full h-full flex flex-row bg-white dark:bg-black border border-black/5 p-6 gap-4">
            <BriefContent brief={brief} setBrief={setBrief} title={title} />
            <BriefSideBar />
          </div>
        </section>
      </div>
    </>
  );
}
