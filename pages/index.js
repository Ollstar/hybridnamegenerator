import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [hybrids, setHybrids] = useState([]);

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
    <div className={styles.container} style={{ height: "100vh" }}>
      <Head>
        <title>Hybrid Superhero Maker</title>
        <link rel="icon" href="/hybrid.png" />
      </Head>
      <div className={styles.header}>
        <img src="/hybrid.png" className={styles.icon} />
        <h3>Make your own super hybrid</h3>
      </div>
      <div className={styles.scrollableContainer} style={{ height: "80%" }}>
        {hybrids.map((hybrid, index) => (
          <div key={index} className={styles.hybridContainer} style={{ display: "flex", justifyContent: "space-between" }}>
            <div className={styles.animal} style={{ textAlign: "left" }}>{hybrid.animal}</div>
            <div className={styles.hybrid} style={{ textAlign: "right" }}>{hybrid.hybrid}</div>
          </div>
        ))}
      </div>
      
      <div className={styles.inputContainer} style={{ height: "20%" }}>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter an animal"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
            className={styles.input}
          />
          <input type="submit" value="Submit" className={styles.submit} />
        </form>
      </div>
    </div>
  );
}
