import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import styles from "./index.module.css";
import Message from "../components/Message";


export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [hybrids, setHybrids] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollableContainerRef = useRef(null);
  //time
  let [timestamp, setTimestamp] = useState(new Date().toLocaleString());

  useEffect(() => {
    if (!timestamp) {
      setTimestamp(new Date().toLocaleString());
    }
    scrollableContainerRef.current.scrollTop = scrollableContainerRef.current.scrollHeight;
  }, [hybrids, timestamp]);

  async function onSubmit(event, animal = animalInput) {
    event.preventDefault();

    let currentTimestamp = new Date().toLocaleString();
    setHybrids([...hybrids, { text: animal, author: "User", timestamp: currentTimestamp }]);

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
      let currentTimestamp2 = new Date().toLocaleString();

      setHybrids([...hybrids, { text: animal, author: "User", timestamp: currentTimestamp }, { text: data.result, author: "RivalAI", timestamp: currentTimestamp2 }]);
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
        <title>Speak to Rival and leave Reviews</title>
        <link rel="icon" href="/Rival_logo_2x.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </Head>
      <div className={styles.header}>
        <img src="/Rival_logo_2x.png" className={styles.icon} />
      </div>
      <div className={styles.scrollableContainer} style={{ width: "100%", height: "80vh" }} ref={scrollableContainerRef}>

    <div className={styles.messageContainer}>
      <Message
        author="RivalAI"
        text="I noticed you had a recent experience with one of our products or events 🤔"
        timestamp={timestamp}>
      </Message>
    </div>

        {hybrids.map((hybrid, index) => (
          <div key={index} className={styles.messageContainer}>
            <div>
              <div className={hybrid.author === "User" ? styles.animalLeft : styles.animalRight}>
                {hybrid.text}
                <div className={styles.subtext}>
                  {hybrid.timestamp} - {hybrid.author}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div style={{ clear: "both" }}></div>
      </div>
      <div className={styles.inputContainer}>
        <form className={styles.form} onSubmit={onSubmit}>
          <input type="text"
            className={styles.input}
            placeholder="Enter input message"
            value={animalInput}
            onChange={e => setAnimalInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' ? onSubmit(e) : null}
          />
                  </form>
          <button type="submit" className={styles.submit} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate"}
          </button>


      </div>
      <div className={styles.footer}>
        <p>Powered by <a href="https://www.rivaltech.com/">Rival</a></p>
      </div>
    </div >
  );
}
