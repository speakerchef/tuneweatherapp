import React, {useEffect, useState} from 'react';

function App(props) {

    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch("/api/items")
            .then(res => res.json())
            .then(data => setItems(data));
        }, []);

    const renderItems = () => {
        return items.map((item, i) => {
            return <div>
                <h3 key={i}>{item}</h3>
            </div>
        })
    }

    return (
        <div>
            <main style={{backgroundColor:"blue", fontFamily: "sans-serif"} }><h1>Hello World</h1>
                {renderItems()}</main>
        </div>
    );
}

export default App;