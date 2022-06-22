import React, { useState } from "react";
import { GRADIENTS } from "../../constants";
import { ControlsState } from "../../reducer";
import imageUploadIcon from "./images/ImageUpload.svg";
import "./Controls.css";

interface Props {
  disableFields: boolean;
  onSubmit: () => void;
  state: ControlsState;
  dispatch: React.Dispatch<any>;
  handleImage: (result?: string | ArrayBuffer | null) => void;
  fileDropImage: string;
}

export function Controls({
  disableFields,
  onSubmit,
  state,
  dispatch,
  handleImage,
  fileDropImage,
}: Props) {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  async function handleFile(fileImage: File) {
    const reader = new FileReader();
    reader.onload = (event) => {
      handleImage(event.target?.result);
      getImageEdgeColor(event.target?.result).then((imageBaseColor) =>
        dispatch({
          type: "INSETCOLOR",
          value: imageBaseColor ?? "#ffffff",
        })
      );
      dispatch({
        type: "COLOR",
        value: "#eeeeee",
      });
    };
    reader.readAsDataURL(fileImage);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (!event.dataTransfer.files?.[0]) return;
    handleFile(event.dataTransfer.files?.[0]);
  }

  return (
    <div className={`card controls ${disableFields ? "disabled" : ""}`}>
      <div className="input range">
        <label htmlFor="size-range">Size</label>
        <input
          disabled={disableFields}
          type="range"
          name="size-range"
          id="Size"
          min="20"
          max="90"
          value={state.size}
          step="1"
          onChange={(e) =>
            dispatch({
              type: "SIZE",
              value: Number(e.target.value),
            })
          }
        ></input>
      </div>
      <div className="input range">
        <label htmlFor="size-range">Border Rounding</label>
        <input
          disabled={disableFields}
          type="range"
          name="size-range"
          id="Size"
          min="0"
          max="100"
          value={state.border}
          step="1"
          onChange={(e) =>
            dispatch({
              type: "BORDER",
              value: Number(e.target.value),
            })
          }
        ></input>
      </div>
      <div className="input range">
        <label htmlFor="size-range">Shadow</label>
        <input
          disabled={disableFields}
          type="range"
          name="size-range"
          id="Size"
          min="0"
          max="100"
          value={state.shadow}
          step="1"
          onChange={(e) =>
            dispatch({
              type: "SHADOW",
              value: Number(e.target.value),
            })
          }
        ></input>
      </div>
      <div className="input range">
        <label htmlFor="size-range">Inset</label>
        <input
          disabled={disableFields}
          type="range"
          name="size-range"
          id="Size"
          min="0"
          max="40"
          value={state.inset}
          step="1"
          onChange={(e) =>
            dispatch({
              type: "INSET",
              value: Number(e.target.value),
            })
          }
        ></input>
      </div>
      <div className="input">
        <label htmlFor="color-range">Background</label>
        <input
          disabled={disableFields}
          type="color"
          id="color-range"
          name="color-range"
          value={state.color ?? ""}
          onChange={(e) =>
            dispatch({
              type: "COLOR",
              value: e.target.value,
            })
          }
        ></input>
        <ul className="gradients">
          {GRADIENTS.map((gradient, index) => (
            <li>
              <a
                className={`${
                  gradient === state.background ? "selected" : ""
                } gradient`}
                style={{ background: gradient } as React.CSSProperties}
                key={gradient}
                aria-label={`gradient ${index}`}
                onClick={(e) =>
                  dispatch({
                    type: "BACKGROUND",
                    value: gradient,
                  })
                }
              ></a>
            </li>
          ))}
        </ul>
      </div>
      <div className="input">
        <label htmlFor="inset-color-range">Inset Color</label>
        <input
          disabled={disableFields}
          type="color"
          id="inset-color"
          name="inset-color-range"
          value={state.insetColor ?? ""}
          onChange={(e) =>
            dispatch({
              type: "INSETCOLOR",
              value: e.target.value,
            })
          }
        ></input>
      </div>

      <div className="input radio">
        <label htmlFor="inset-color-range">Aspect Ratio</label>
        {["1/1", "5/4", "3/2"].map((aspectRatio, index) => {
          return (
            <div className="radio">
              <label>
                <input
                  type="radio"
                  value={aspectRatio}
                  checked={state.aspectRatio === aspectRatio}
                  onChange={() => {
                    dispatch({
                      type: "ASPECTRATIO",
                      value: aspectRatio,
                    });
                  }}
                />
                {aspectRatio}
              </label>
            </div>
          );
        })}
      </div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`${isDragging ? "active" : ""} drag-area`}
      >
        {fileDropImage ? (
          <>
            <img src={fileDropImage} alt="" />
            Or drag another image
          </>
        ) : (
          <>
            <img src={imageUploadIcon} className="uploadIcon" />
            {isDragging ? "Release to upload" : "Drag & Drop to Upload File"}
            <input
              type="file"
              name="myImage"
              onChange={(event) => {
                if (!event.target.files?.[0]) return;
                handleFile(event.target.files?.[0]);
              }}
            />
          </>
        )}
      </div>
      <button type="submit" disabled={disableFields} onClick={onSubmit}>
        Build Image
      </button>
    </div>
  );
}

async function getImageEdgeColor(image: any) {
  if (!image) return;
  var canvas = document.createElement("canvas");
  var canvasContext = canvas.getContext("2d");
  var img = new Image();
  img.src = image;
  await img.decode().then(() => {
    canvas.width = img.width;
    canvas.height = img.height;
    canvasContext?.drawImage(img, 0, 0, img.width, img.height);
  });
  const [r, g, b, a, ..._] = Array.from(
    canvasContext?.getImageData(1, 1, 1, 1).data ?? []
  );
  return rgbaToHex(r, g, b, a);
}

function rgbaToHex(r: number, g: number, b: number, a: number) {
  var outParts = [
    r.toString(16),
    g.toString(16),
    b.toString(16),
    Math.round(a * 255)
      .toString(16)
      .substring(0, 2),
  ];

  // Pad single-digit output values
  outParts.forEach(function (part, i) {
    if (part.length === 1) {
      outParts[i] = "0" + part;
    }
  });

  return "#" + outParts.join("").slice(0, 6);
}
