import React, {useState, useCallback, useEffect } from 'react';
import './TaskThree.css';
import { debounce } from 'lodash'

// функция для получения данных с Mock API



export default function TaskThree() {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState();
    const [isLoading, setLoading] = useState(true);

    const fetchData = useCallback(async (search) => {
        try {
            const res = await fetch(`https://jsonplaceholder.typicode.com/posts?search=${search}`);
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
        
         // Используем debounce, чтобы уменьшить количество запросов
         const debouncedFetchData = debounce(async(search) => {
         await fetchData(search, abortController);
        }, 500); // 500 мс задержки
        
        // Вызовем дебаунсированную функцию
        debouncedFetchData(search);
        
        return () => {
        abortController.abort(); // Отменить предыдущий запрос при изменении search
        debouncedFetchData.cancel(); // Отменить все отложенные вызовы debounce
        };
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
