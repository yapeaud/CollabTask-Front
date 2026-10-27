import React, { useEffect ,useState } from "react"
import axios from "axios";
import { Trash } from "lucide-react"


function Notifications({setNotifBadgeActive,notificationsMenuOpen,setNotificationsMenuOpen}){
     
     const [isRead,setIsRead]=useState(false)

     const yo=[
        {
            id:1,
            user:"Alain benjamin",
            title:"Application de gestion des stocks",
            description:"Ajout des fichiers d'analyse du projet ",
            date:"12/08/2024",
            isRead:true
        },
     ]

   /* const notifications=useEffect(()=>{
        axios.get('http://localhost:5000/api/notif/retrieves')
    },[])*/

    const [filteredNotifications, setFilteredNotifications]=useState(
        Notifications.filter(notification=>notification.isRead===isRead)
    )
    
    function FilterNotifications (isRead) {
        setIsRead(isRead);
        setFilteredNotifications(
            Notifications.filter(notification=>notification.isRead===isRead)
        )
     }
     //fonction pour retourner un boolean au composant parent pour activer  le badge de notification
     useEffect(()=>{
         if (filteredNotifications.length) setNotifBadgeActive(true)
     },[])
    return(
        <main
            className={!notificationsMenuOpen && "hidden"}
        >
            <div className=" fixed inset-0 z-10 " onClick={() => setNotificationsMenuOpen((open) => !open)}/>
            <div
                className=" absolute right-0   bg-white w-[400px] h-[85vh] rounded-md z-20 mt-6 shadow-sm border-2 border-gray-200"
            >
                <section
                    className="p-4 pt-3"
                >
                    <header className="text-xl text-[#121212] font-bold" >
                        Centre de notifications
                    </header>
                    <section className="flex mt-3 gap-2 font-semibold">
                        <button
                            className={`flex items-center  justify-center text-sm  w-20 p-0.5 ${!isRead ? " bg-brand-blue rounded text-[#f1f1f1] " :"text-gray-500"} transition-all duration-300 `}
                            onClick={()=>FilterNotifications(false)}
                        >
                            Non-lues
                        </button>
                        <button
                            className={`flex items-center  justify-center text-sm  w-20 p-0.5 ${isRead ? " bg-brand-blue rounded text-[#f1f1f1] " :"text-gray-500"} transition-all duration-300 `}
                            onClick={()=> FilterNotifications(true)}
                        >
                            Lues
                        </button>
                    </section>
                    <section
                        className="overflow-y-scroll h-[65vh] mt-4 "
                    >
                        {!filteredNotifications.length ? (
                            <div className="flex items-center justify-center min-h-screen text-gray-400 font-semibold">
                                Aucune notification pour le moment
                            </div>
                        ):(
                            filteredNotifications.map(notification=>
                                <div
                                className="  truncate  flex flex-col gap-1.5 mt-2 border border-gray-300 shadow-sm rounded-md p-1.5 cursor-pointer hover:bg-slate-100 transition-all duration-200"
                                key={notification.id}
                                >
                                    <div
                                        className="flex justify-between items-center"
                                    >
                                        <h2
                                            className="font-bold  w-[300px] truncate "
                                        >
                                            {notification.title}
                                        </h2>
                                        <div
                                            className="flex gap-1 items-center"
                                        >
                                            <h3
                                              className="text-xs text-gray-400"
                                            >
                                                {notification.date}
                                            </h3>
                                            <Trash size={18} className="text-red-600 cursor-pointer w-6 h-5 p-0.5 bg-gray-200 rounded-sm" />
                                        </div>
                                    </div>
                                    <h2
                                    className="font-semibolder text-sm text-gray-900 truncate w-[250px] "
                                    >
                                        {notification.user}
                                    </h2>
                                    <h3
                                    className="w-[330px] text-sm text-gray-600 truncate"
                                    >
                                        {notification.description}
                                    </h3>
                                </div>
                            )
                            
                        )}
                    </section>
                </section>
            </div>
            
        </main>
    )
}

export default Notifications ;