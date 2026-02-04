import { useState } from "react";
import type { Folder, File } from "../../dataClient/folders";
import { Limb } from "../Limb/Limb";
import { Form } from "react-router-dom";

export function Branch(props: { folder: Folder }) {
  const [expanded, setExpanded] = useState(false);
  const [actionVisible, setActionVisible] = useState(false);
  const [limbActionVisible, setLimbActionVisible] = useState<number>();

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2px",
        }}
        onMouseEnter={() => setActionVisible(true)}
        onMouseLeave={() => setActionVisible(false)}
      >
        <div
          style={{ cursor: "pointer", color: "lightblue" }}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "[-]" : "[+]"}
        </div>
        <Limb name={props.folder.name} />
        {actionVisible && (
          <BranchActions
            folder={props.folder}
            onSubmit={() => setActionVisible(false)}
          />
        )}
      </div>

      {expanded && (
        <div style={{ marginLeft: 20 }}>
          {props.folder.content.map((item, index) =>
            item.type === "file" ? (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center", gap: "2px" }}
                onMouseEnter={() => setLimbActionVisible(index)}
                onMouseLeave={() => setLimbActionVisible(undefined)}
              >
                <Limb name={item.name} />
                {limbActionVisible === index && (
                  <LimbActions
                    file={item}
                    onSubmit={() => setLimbActionVisible(undefined)}
                  />
                )}
              </div>
            ) : (
              <Branch key={index} folder={item} />
            ),
          )}
        </div>
      )}
    </div>
  );
}

function BranchActions(props: { folder: Folder; onSubmit: () => void }) {
  const [selectedType, setSelectedType] = useState<
    "file" | "folder" | "move" | null
  >(null);

  if (selectedType === "file" || selectedType === "folder") {
    return (
      <AddFileFolder
        folder={props.folder}
        selectedType={selectedType}
        onSubmit={props.onSubmit}
      />
    );
  } else if (selectedType === "move") {
    return <MoveFileFolder folder={props.folder} onSubmit={props.onSubmit} />;
  }

  return (
    <div style={{ display: "flex", gap: 2 }}>
      <button
        onClick={() => {
          setSelectedType("folder");
        }}
      >
        +Folder
      </button>
      <button
        onClick={() => {
          setSelectedType("file");
        }}
      >
        +File
      </button>
      <button
        onClick={() => {
          setSelectedType("move");
        }}
      >
        Move
      </button>
    </div>
  );
}

function LimbActions(props: { file: File; onSubmit: () => void }) {
  return <MoveFileFolder folder={props.file} onSubmit={props.onSubmit} />;
}

function AddFileFolder(props: {
  folder: Folder;
  selectedType: "file" | "folder";
  onSubmit: () => void;
}) {
  const [inputName, setInputName] = useState("");

  return (
    <div>
      Adding new {props.selectedType} to {props.folder.name}
      <Form
        method="post"
        onSubmit={() => {
          props.onSubmit();
        }}
      >
        <input
          placeholder="Enter name"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          autoFocus
          name="name"
        />
        <input type="hidden" name="type" value={props.selectedType} />
        <input type="hidden" name="path" value={props.folder.path} />
        <button
          onClick={(e) => {
            if (!inputName) {
              e.preventDefault();
            }
          }}
          type="submit"
        >
          Submit
        </button>
      </Form>
    </div>
  );
}

function MoveFileFolder(props: {
  folder: Folder | File;
  onSubmit: () => void;
}) {
  const [newPath, setNewPath] = useState("");

  return (
    <div>
      Moving to:
      <Form
        method="post"
        onSubmit={() => {
          props.onSubmit();
        }}
      >
        <input
          placeholder="Enter new path"
          value={newPath}
          onChange={(e) => setNewPath(e.target.value)}
          autoFocus
          name="newPath"
        />
        <input type="hidden" name="type" value={"move"} />
        <input type="hidden" name="path" value={props.folder.path} />
        <button
          onClick={(e) => {
            if (!newPath) {
              e.preventDefault();
            }
          }}
          onSubmit={props.onSubmit}
          type="submit"
        >
          Submit
        </button>
      </Form>
    </div>
  );
}
