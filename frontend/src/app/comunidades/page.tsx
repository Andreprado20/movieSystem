import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import CommunityView from "@/components/community-view"

export default function Comunidades() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden w-full">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="md:hidden w-full">
          <Sidebar />
        </div>
        <div className="flex-1 w-full">
          <CommunityView />
        </div>
      </div>
    </div>
  )
}
