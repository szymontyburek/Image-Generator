import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Container />
    </div>
  );
}

function TextField({ onType }) {
  const [nodeValue, setNodeValue] = useState("");

  function getText(e) {
    const val = e.target.value;
    setNodeValue(val);
    onType(val); //pass data to parent
  }

  return (
    <textarea
      style={{ width: "80%", height: "300px" }}
      value={nodeValue}
      onChange={getText}
    ></textarea>
  );
}

function Submit({ data, onClick }) {
  return (
    <button
      style={{ marginTop: "1em", padding: "1em", width: "80%" }}
      onClick={() => onClick(data)}
    >
      Submit
    </button>
  );
}

function Container() {
  const [sharedData, setSharedData] = useState("");

  const dataChange = function (newData) {
    setSharedData(newData);
  };

  async function exportText(text) {
    const params = { content: text };

    try {
      const response = await axios.get("http://localhost:8080/generateImage", {
        params,
      });
      debugger;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Image Generator</h1>
      <TextField onType={dataChange} />
      <Submit data={sharedData} onClick={exportText} />
    </div>
  );
}

export default App;
