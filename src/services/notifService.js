import api from "./api";


export async function create({userid,type,title,message,sourcetype,sourceid}) {
    const {data} = await api.post("/notif/create",{userid,type,title,message,sourcetype,sourceid});
    return data;
    
}

export async function retrieves(userid) {
    const {data} = await api.get("/notif/retrieves",{
        params:{userid:userid},
        
    });
    return data;
    
}

export async function Remove(notificationid) {
    const {data}= await api.delete("/notif/remove",{
        params:{notificationid}
    })
    return data;
}

export async function RemoveAll() {
    const {data}= await api.delete("/notif/removeAll")
    return data;
}

export async function setRead(notificationid) {
    const {data}= await api.patch("/notif/setRead",null,{
        params:{notificationid}
    })
    return data;

}
export async function setAllAsRead() {
    const {data}= await api.patch("/notif/setAllAsRead",null)
    return data;

}
