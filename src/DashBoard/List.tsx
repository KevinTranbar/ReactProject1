import { useState, useEffect } from 'react'
import { supabase } from "../supabaseClient"
import styles from './List.module.css'

interface listItem {
    id: number;
    ListItem: string;
    Order: number;
}

function List() {

    const [list, setList] = useState<listItem[]>([]);
    const [newItem, setNewItem] = useState("");

    useEffect(() => {
        supabase.from("toDoList")
            .select("*")
            .order("Order", { ascending: true })
            .then(({ data }) => {
                setList(data ?? []) //If data is null, use empty array instead
            });

        const supabaseChannel = supabase.channel("listChanges")
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "toDoList",
            }, () => {
                supabase.from("toDoList")
                    .select("*")
                    .order("Order", { ascending: true })
                    .then(({ data }) => {
                        setList(data ?? []) //If data is null, use empty array instead
                    });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(supabaseChannel);
        }
    }, []);

    async function handleAddItem() {
        if (!newItem.trim()) return;
        const { data } = await supabase.from("toDoList").insert({
            ListItem: newItem,
            Order: list.length
        }).select(); //Get newly inserted data
        if (data) setList([...list, data[0]])
        setNewItem("");
    }

    async function handleRemoveItem(index: number) {
        const item = list[index];
        setList(list.filter((_, i) => i !== index));
        await supabase.from("toDoList")
            .delete()
            .eq("id", item.id);
    }

    async function moveItemUp(index: number) {
        if (index <= 0) return;
        const itemA = list[index];
        const itemB = list[index - 1];
        //Update list for user
        const updatedList = [...list];
        updatedList[index] = { ...itemA, Order: itemB.Order };
        updatedList[index - 1] = { ...itemB, Order: itemA.Order };
        [updatedList[index - 1], updatedList[index]] = [updatedList[index], updatedList[index - 1]];
        setList(updatedList);

        //Update list in database
        await supabase.from("toDoList").update({ Order: itemB.Order }).eq("id", itemA.id);
        await supabase.from("toDoList").update({ Order: itemA.Order }).eq("id", itemB.id);
    }

    async function moveItemDown(index: number) {
        if (index >= list.length - 1) return;
        const itemA = list[index];
        const itemB = list[index + 1];
        //Update list for user
        const updatedList = [...list];
        updatedList[index] = { ...itemA, Order: itemB.Order };
        updatedList[index + 1] = { ...itemB, Order: itemA.Order };
        [updatedList[index + 1], updatedList[index]] = [updatedList[index], updatedList[index + 1]];
        setList(updatedList);

        //Update list in database
        await supabase.from("toDoList").update({ Order: itemB.Order }).eq("id", itemA.id);
        await supabase.from("toDoList").update({ Order: itemA.Order }).eq("id", itemB.id);
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>To Do List</h2>
            <div className={styles.inputGroup}>
                <input
                    className={styles.input}
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add a new task..."
                />
                <button className={styles.btnAdd} onClick={handleAddItem}>Add</button>
            </div>
            {list.length === 0 ? (
                <p className={styles.empty}>No tasks yet</p>
            ) : (
                <ul className={styles.list}>
                    {list.map((item, index) => ( //item = object in list
                        <li className={styles.item} key={item.id}>
                            <span className={styles.itemText}>{item.ListItem}</span>
                            <button className={styles.btnAction} onClick={() => moveItemUp(index)}>Up</button>
                            <button className={styles.btnAction} onClick={() => moveItemDown(index)}>Down</button>
                            <button className={styles.btnRemove} onClick={() => handleRemoveItem(index)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default List