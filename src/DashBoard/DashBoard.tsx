import { supabase } from "../supabaseClient";
import { useEffect } from "react";
import styles from "./DashBoard.module.css";
import List from "./List";
import OnlineUsers from "../OnlineUsers/OnlineUsers";

interface dashBoardProps {
    setLoggedInProp: (value: boolean) => void
}

function DashBoard({ setLoggedInProp }: dashBoardProps) {

    useEffect(() => {
        document.title = 'DashBoard';
    }, []);

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) console.error(error.message);
        else setLoggedInProp(false);
    }

    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <span className={styles.logo}>Dashboard</span>
                <button className={styles.btnSignOut} onClick={handleSignOut}>Sign out</button>
            </header>
            <main className={styles.content}>
                <div>
                    <OnlineUsers></OnlineUsers>
                </div>
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <List></List>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DashBoard