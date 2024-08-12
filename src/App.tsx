import { useCallback, useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const ws = new WebSocket("ws://localhost:7007");

function getUniqueID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + "-" + s4();
}

function useSyncedState<T>(initialValue: T): [T, (newValue: T) => void] {
  // avoid weird inferred type
  const [value, setValue] = useState(initialValue);

  const id = useRef(getUniqueID());

  useEffect(() => {
    const onOpen = () => {
      console.log("connected");
      ws.send(JSON.stringify({ id: id.current }));
    };

    const onMessage = (event: MessageEvent) => {
      try {
        const json = JSON.parse(event.data);
        const data = json.data;

        const actualStuff = JSON.parse(data);
        const payload = actualStuff.payload;

        //so confused as to why I need parse twice here but ya know it works
        console.log(
          "received message from: ",
          actualStuff.id,
          "with payload: ",
          payload
        );

        if (payload) {
          setValue(payload);
        }
      } catch (error) {
        console.error(error);
      }
    };

    try {
      ws.addEventListener("open", onOpen);

      ws.addEventListener("message", onMessage);
    } catch (error) {
      console.error(error);
    }
    return () => {
      ws.removeEventListener("message", onMessage);
      ws.removeEventListener("open", onOpen);
    };
  });

  const setSyncedValue = useCallback((newValue: T) => {
    setValue(newValue);
    ws.send(JSON.stringify({ payload: newValue, id: id.current }));
  }, []);

  return [value, setSyncedValue];
}

function App() {
  const [count, setCount] = useSyncedState<number>(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount(count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
