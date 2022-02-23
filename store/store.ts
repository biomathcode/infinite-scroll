import create from "zustand";
import {v4 as uuidv4} from 'uuid';



// taken from stakeoverflow
declare var process : {
    env: {
      API_KEY: string
    }
  }

export interface Data {
    id: string
    title: string
    firstName: string
    lastName: string
    picture: string
}

interface DATASTORE {
    users: Data[];
    initialFetch: (url: string)=> void
    fetchmore: (url:string, page:number, limit: number, users: Data[], key: string) => void;
}
  
const useStore = create<DATASTORE>((set) => ({
    users: [],
    initialFetch: async (url: string) => {
        const response = await fetch(url, {
            method:'get', 
            headers: {
                'Content-Type': 'application/json', 
                // 'app-id': '',
            }
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json() ;
        
        set({ users: data.data })
    },
    fetchmore:async (url:string, page:number, limit: number, users: Data[], key: string) => {
        const response = await fetch(url + '?page=' + page + '&limit=' + limit, {
            method:'get', 
            headers: {
                'Content-Type': 'application/json', 
                'app-id': key,
            }
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json() ;
        const newData = [...users, ...data.data ]
        set({users: newData});
    }
   
}))
  








export {useStore }