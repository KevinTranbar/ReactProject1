import { supabase } from "../supabaseClient";
import { useState, useEffect } from "react";
import styles from "./Login.module.css";

interface loginProps {
    setLoggedInProp: (value: boolean) => void
}

function Login({ setLoggedInProp }: loginProps) {

    useEffect(() => {
        document.title = 'Login';
    }, []);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignIn = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        if (error) console.error(error.message);
        else setLoggedInProp(true);
    }

    const handleSignUp = async () => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        });
        if (error) console.error(error.message);
        else handleSignIn();
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <>
                    <h1 className={styles.title}>Welcome back</h1>
                    <p className={styles.subtitle}>Sign in to your account</p>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="email">Email</label>
                        <input
                            className={styles.input}
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            type="email"
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="password">Password</label>
                        <input
                            className={styles.input}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            type="password"
                        />
                    </div>

                    <div className={styles.actions}>
                        <button className={styles.btnPrimary} onClick={handleSignIn}>Sign in</button>
                        <button className={styles.btnSecondary} onClick={handleSignUp}>Create account</button>
                    </div>
                </>
            </div>
        </div>
    );
}

export default Login