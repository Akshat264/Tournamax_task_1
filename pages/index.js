import { useState, useEffect } from 'react';
import ItemForm from '../components/ItemForm';
import styles from './index.module.css'; 
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export default function Home() {
    const [items, setItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch('/api/items');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setItems(data.data);
        } catch (error) {
            console.error('Failed to fetch items:', error);
        }
    };

    const handleCreateOrUpdate = async (item) => {
        try {
            if (editingItem) {
                const response = await fetch(`/api/items/${editingItem._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(item),
                });
                if (!response.ok) {
                    throw new Error('Failed to update item');
                }
                setEditingItem(null);
            } else {
                const response = await fetch('/api/items', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(item),
                });
                if (!response.ok) {
                    throw new Error('Failed to create item');
                }
            }
            fetchItems();
        } catch (error) {
            console.error('Error handling item:', error);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
    };

    const handleDelete = async (id) => {
        const con= confirm("Click OK if you want to delete the item");
        if(con){
        try {
            const response = await fetch(`/api/items/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete item');
            }
            fetchItems();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Tournamax Assignment</h1>
            <div className={styles.itemForm}>
                <ItemForm
                    onSubmit={handleCreateOrUpdate}
                    initialData={editingItem}
                    clearAfterSubmit
                />
            </div>
            <TransitionGroup className={styles.list}>
                {items.map((item) => (
                    <CSSTransition
                        key={item._id}
                        timeout={500}
                        classNames="item"
                    >
                        <div className={styles.item}>
                            <span className={styles.itemText}><b>{item.name}</b> - {item.description}</span>
                            <div>
                                <button onClick={() => handleEdit(item)}>Edit</button>
                                <button onClick={() => handleDelete(item._id)}>Delete</button>
                            </div>
                        </div>
                    </CSSTransition>
                ))}
            </TransitionGroup>
        </div>
    );
}
