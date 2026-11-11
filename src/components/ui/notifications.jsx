import React, { useEffect ,useState } from "react"
import { retrieves,Remove, RemoveAll, setRead, setAllAsRead } from "../../services/notifService"
import { CheckCheck, Circle, CircleArrowLeft, Trash, Trash2, X } from "lucide-react"
import { fetchCurrentUser } from "../../services/authService";

function Notifications({setNotifBadgeActive,notificationsMenuOpen,setNotificationsMenuOpen}){
     
     const [isRead,setIsRead]=useState(false);
     const [Notifications,setNotifications]=useState([]);
     const [isLoading,setIsLoading]=useState(false);
     let filteredNotifications =Notifications.filter(n=>n.isread===isRead);


     useEffect(()=>{
        async function fetchNotif() {
            try {
                setIsLoading(true);
                const user= await fetchCurrentUser();
                const userid = user.userid;
                const res= await retrieves(userid);
                if(res.success){
                    setNotifications(res.notifications.map(el=>{
                        if(el.type==="COMMENT_ADDED")return{...el,type:"Nouveau commentaire!"};
                        if(el.type==="TASK_ASSIGNED")return{...el,type:" Nouvelle tache assignée!"};
                        if(el.type==="TASK_STATUS_CHANGED")return{...el,type:"Changement du statut d'une tache!"};
                        if(el.type==="DUE_DATE_REMINDER")return{...el,type:"Rappel à l'échéance!"};
                        if(el.type==="PROJECT_INVITATION")return{...el,type:"Invitation de projet !"};
                        if(el.type==="TEAM_INVITATION")return{...el,type:"Invitation d'équipe!"};
                    }));
                }
            } catch (error) {
                console.log("Erreur serveur.");
            }finally{
                setIsLoading(false)
            }
        }
        fetchNotif();
     },[]);

    
    function FilterNotifications (isRead) {
        setIsRead(isRead);
        filteredNotifications=Notifications.filter(notification=>notification.isread===isRead)
     }
     //fonction pour retourner un boolean au composant parent pour activer  le badge de notification
     useEffect(()=>{
         if (filteredNotifications.length && !isRead) setNotifBadgeActive(true)
     },[filteredNotifications])

     async function RemoveNotification(notificationid) {
        try {
           const res = await Remove(notificationid);
            if(res.success) {
                setNotifications(
                    Notifications.filter(el=>el.notificationid!=notificationid)
                )
            }
        } catch (error) {
            console.log("Erreur serveur.")
        }
     }
     async function RemoveAllNotifications() {
        try {
           const res = await RemoveAll();
            if(res.success) {
                setNotifications([{}])
            }
        } catch (error) {
            console.log("Erreur serveur.")
        }
     }
     async function SetAsRead(notificationid) {
        try {
           const res = await setRead(notificationid);
            if(res.success) {
               setNotifications(
                    Notifications.map(el=>{
                        if(el.notificationid===notificationid)return {...el, isread:true};
                        return el;
                    })
                )
            }
        } catch (error) {
            console.log("Erreur serveur.")
        }
     }
     async function SetAllAsRead() {
        try {
           const res = await setAllAsRead();
            if(res.success) {
               setNotifications(
                    Notifications.map(el=>{
                        if(!el.isread)return {...el, isread:true};
                        return el;
                    })
                )
            }
        } catch (error) {
            console.log("Erreur serveur.")
        }
     }
    
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
                            className={`flex items-center  justify-center text-sm  w-20 p-0.5 ${!isRead ? " bg-brand-blue rounded text-[#fff] " :"text-gray-500"} transition-all duration-300 `}
                            onClick={()=>FilterNotifications(false)}
                        >
                            Non-lues
                        </button>
                        <button
                            className={`flex items-center  justify-center text-sm  w-20 p-0.5 ${isRead ? " bg-brand-blue rounded text-[#fff] " :"text-gray-500"} transition-all duration-300 `}
                            onClick={()=> FilterNotifications(true)}
                        >
                            Lues
                        </button>
                        <button
                            className={`flex items-center  justify-center text-sm  w-10 p-0.5  bg-red-600 rounded text-[#fff]  transition-all duration-300 `}
                            onClick={()=> RemoveAllNotifications()}
                        >
                            <Trash2 
                                size={18}
                                className="h-4 w-4"
                                aria-label="Tout supprimer!"
                            />
                        </button>
                        <button
                            disabled={isRead}
                            className={`flex items-center  justify-center text-sm  w-10 p-0.5  bg-brand-blue rounded text-[#fff]  transition-all duration-300 ${isRead? "!bg-gray-500":""} `}
                            onClick={()=> SetAllAsRead()}
                        >
                            <CheckCheck 
                                size={18}
                                className="h-4 w-4"
                                aria-label="marquer tout comme lu!"
                            />
                        </button>
                    </section>
                    <section
                        className="overflow-y-scroll h-[65vh] mt-4 "
                    >
                        {isLoading?(
                            <div className="flex items-center justify-center min-h-screen text-gray-400 font-semibold">
                                    <CircleArrowLeft size={18} className="h-4 w-4 animate-spin duration-150" />
                                    <span
                                        className="animate-pulse duration-150"
                                    >
                                        Chargement...
                                    </span>
                            </div>
                            ):(
                            !filteredNotifications.length ? (
                                <div className="flex items-center justify-center min-h-screen text-gray-400 font-semibold">
                                    Aucune notification pour le moment
                                </div>
                            ):(
                                filteredNotifications.map(notification=>
                                    <div
                                    className="  truncate  flex flex-col gap-1.5 mt-2 border border-gray-300 shadow-sm rounded-md p-1.5 cursor-pointer hover:bg-slate-100 transition-all duration-200"
                                    key={notification.id}
                                    onClick={()=>SetAsRead(notification.notificationid)}
                                    >
                                        <div
                                            className="flex justify-between items-center"
                                        >
                                            <h2
                                                className="font-semibold  w-[300px] truncate "
                                            >
                                                {notification.title}
                                            </h2>
                                            <div
                                                className="flex gap-1 items-center"
                                            >
                                                <h3
                                                className="text-xs text-gray-400"
                                                >
                                                    {notification.createdat.slice(0,10)}
                                                    {" "+notification.createdat.slice(11,16)}
                                                </h3>
                                                <X
                                                    size={18} 
                                                    className="text-red-600 cursor-pointer w-6 h-5 p-0.5 border border-red-300 rounded-sm z-50" 
                                                    onClick={()=>RemoveNotification(notification.notificationid)} 
                                                />
                                            </div>
                                        </div>
                                        <h2
                                        className="font-semibolder text-xs text-gray-900 truncate w-[250px] "
                                        >
                                            {notification.type}
                                        </h2>
                                        <h3
                                        className="w-[330px] text-sm text-gray-600 truncate"
                                        >
                                            {notification.message}
                                        </h3>
                                    </div>
                                )
                                
                            )
                        )}
                    </section>
                </section>
            </div>
            
        </main>
    )
}

export default Notifications ;