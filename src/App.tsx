import React, { useState, useCallback, useEffect } from "react";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import styles from "./App.module.css";

const subject = new Subject<string>();

function App() {
  const [text$, setText$] = useState<string>("");
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const subscription = subject
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((v) => setText(v));
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const changeText = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setText$(event.target.value);
      subject.next(event.target.value);
    },
    []
  );

  return (
    <div className={styles.root}>
      <div className={styles.spacer}>
        <input
          className={styles.searchBox}
          onChange={changeText}
          value={text$}
        />
      </div>
      <h4>Type and wait for 1 second</h4>
      <div className={styles.spacer}>
        <h3>{text}</h3>
      </div>
    </div>
  );
}

export default App;
