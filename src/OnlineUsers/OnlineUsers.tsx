import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient';
import styles from './OnlineUsers.module.css';

function OnlineUsers() {

    const [users, setUsers] = useState<any[]>([])

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            let email: any;
            let displayName: any;
            if (session) {
                email = session.user.email; //Gets email from user session
                displayName = email.split("@")[0];
            }
            else displayName = "Guest";

            const supabaseChannel = supabase.channel("OnlineUsers")
                .on("presence", { //Looks at users
                    event: "sync", //Activates when changes in users
                }, () => { //Doesn't run until change in users
                    const activeUsers = supabaseChannel.presenceState();
                    setUsers(Object.values(activeUsers))
                })
                .subscribe(async (status) => { //status = value sent to callback by .subscribe
                    if (status === "SUBSCRIBED") //When successful subscribe -> user connect to channel
                        await supabaseChannel.track({ user: displayName }); //Triggers sync event above (connects user to channel)
                });

            return () => {
                supabase.removeChannel(supabaseChannel);
            }
        })
    }, [])

    return (
        <div className={styles.container}>
            <p className={styles.header}>Users Online: {users.length}</p>
            <ul className={styles.list}>
                {users.map((user, index) => <li className={styles.listItem} key={index}>{user[0].user}</li>)}
            </ul>
        </div>
    );

}

export default OnlineUsers