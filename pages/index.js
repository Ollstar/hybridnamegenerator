import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [hybrids, setHybrids] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollableContainerRef = useRef(null);

  async function onSubmit(event, animal = animalInput) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setHybrids([...hybrids, { animal, hybrid: data.result }]);
      setAnimalInput("");
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }


  return (
    <div className={styles.container} style={{ height: "100vh" }}>
      <Head>
        <title>Hybrid Superhero Maker</title>
        <link rel="icon" href="/bot1.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </Head>
      <div className={styles.header}>
        <img src="/bot1.png" className={styles.icon} />
        <h3>RivalAI</h3>
      </div>
      <div className={styles.scrollableContainer} style={{ width: "100%", height: "80vh" }} ref={scrollableContainerRef}>
        
        {hybrids.map((hybrid, index) => (
          <div key={index}>
            <div className={styles.animal} style={{ padding: "10px", float: "left" }}>{hybrid.animal}</div>
            <div className={styles.hybrid} style={{ padding: "10px", float: "right" }}>{hybrid.hybrid}</div>
            <div style={{ clear: "both" }}></div>
          </div>
        ))}
        <div style={{ clear: "both" }}></div>
      </div>
      <form className={styles.form} onSubmit={onSubmit}>
        <input type="text" 
        className={styles.input} 
        placeholder="Enter input message" 
        value={animalInput} 
        onChange={e => setAnimalInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' ? onSubmit(e) : null}
        />
        <button  type="submit" className={styles.submit} disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate"}
        </button>

      </form>
    </div>
  );
}
