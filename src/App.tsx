import React, { useState, useReducer, useRef } from "react";
import "./App.css";
import html2canvas from "html2canvas";
import { flushSync } from "react-dom";
import { Controls } from "./components";
import { initialControlsState, controlsReducer } from "./reducer";

function App() {
  const [controlsState, controlsDispatch] = useReducer(
    controlsReducer,
    initialControlsState
  );
  const screenshotRef = useRef<HTMLDivElement>(null);
  const [finalImage, setFinalImage] = useState<string>();
  const [uploadImage, setUploadImage] = useState<any>(null);
  const generatedRef = useRef<HTMLDivElement>(null);

  async function generateImage() {
    if (!screenshotRef.current) return;
    const canvas = await html2canvas(screenshotRef.current, {
      scale: 3,
      // onclone: (_, element) =>
      //   element.insertAdjacentText("beforeend", "watermark"),
    });
    flushSync(() => {
      setFinalImage(canvas.toDataURL("image/png", 1.0));
    });
    generatedRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }

  return (
    <>
      <header>
        <h1>Screenshot Builder Thing</h1>
      </header>
      <div className="App">
        <Controls
          disableFields={!Boolean(uploadImage)}
          onSubmit={generateImage}
          state={controlsState}
          dispatch={controlsDispatch}
          handleImage={setUploadImage}
          fileDropImage={uploadImage}
        />
        <div className="imageHolder card">
          {uploadImage ? (
            <div
              className="screenshot"
              style={
                {
                  "--s-color": controlsState.color ?? "initial",
                  "--s-background": controlsState.background ?? "initial",
                  "--s-border-radius": `${controlsState.border}px`,
                  "--s-aspect-ratio": controlsState.aspectRatio,
                } as React.CSSProperties
              }
              ref={screenshotRef}
            >
              <div
                className="inset"
                style={
                  {
                    "--s-scale": `scale(${Math.max(
                      controlsState.size / 100,
                      0.01
                    )})`,
                    "--s-inset": `${controlsState.inset}px`,
                    "--s-inset-color": controlsState.insetColor,
                    "--s-shadow": Math.max(controlsState.shadow / 100, 0.01),
                  } as React.CSSProperties
                }
              >
                <img src={uploadImage} />
              </div>
            </div>
          ) : (
            <span>Please upload an image</span>
          )}
        </div>
      </div>
      {finalImage && (
        <div className="card generated" ref={generatedRef}>
          <h2>Final Image</h2>
          <img className="rendered" src={finalImage} />
        </div>
      )}
    </>
  );
}

export default App;
