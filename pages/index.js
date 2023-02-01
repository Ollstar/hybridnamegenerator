import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [hybrids, setHybrids] = useState([]);
  const scrollableContainerRef = useRef(null);


  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setHybrids([...hybrids, { animal: animalInput, hybrid: data.result }]);
      setAnimalInput("");
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className={styles.container} style={{ height: "100vh"}}>
      <Head>
        <title>Hybrid Superhero Maker</title>
        <link rel="icon" href="/hybrid.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </Head>
      <div className={styles.header}>
        <img src="/hybrid.png" className={styles.icon} />
        <h3>Make your own super hybrid</h3>
      </div>
      <div className={styles.scrollableContainer} style={{width: "100%",height: "100%"}} ref={scrollableContainerRef}>
        {hybrids.map((hybrid, index) => (
          <div key={index}>
            <div className={styles.animal} style={{padding: "10px", float: "left" }}>{hybrid.animal}</div>
            <div className={styles.hybrid} style={{padding: "10px", float: "right" }}>{hybrid.hybrid}</div>
          </div>
        ))}
      </div>
      
      <div className={styles.inputContainer} style={{ height: "20vh" }}>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter an animal"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' ? onSubmit(e) : null}

            className={styles.input}
            />
          <input type="submit" value="Submit" className={styles.submit} />
        </form>
      </div>
    </div>
  );
}
