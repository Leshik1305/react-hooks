import React, {useState, useCallback, useEffect } from 'react';
import './TaskThree.css';

// функция для получения данных с Mock API



export default function TaskThree() {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState();
    const [isLoading, setLoading] = useState(true);

    const fetchData = useCallback(async (search, abortController) => {
        try {
            const res = await fetch(`https://jsonplaceholder.typicode.com/posts?search=${search}`, { signal: abortController.signal });
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Fetch aborted');
            } else {
                console.log('An error occurred:', error);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const abortController = new AbortController();
        setLoading(true);
        fetchData(search, abortController);

        return () => abortController.abort();
    }, [search, fetchData]);

    



    return (
        <div className="TaskThree">
            <input type="text" 
            onChange={(event) => setSearch(event.target.value)} 
            placeholder="Search posts"/>
            <h1>Posts</h1>
            { isLoading
                ? <div className="loading">Loading...</div>
                : <ul>
                {posts.map((item) => (
                  <li key={item.id}>
                    {item.title}
                  </li>
                ))}
              </ul> 
            }
        </div>
    )
}
