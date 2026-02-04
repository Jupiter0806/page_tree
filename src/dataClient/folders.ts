import localforage from "localforage";

export type FSType = "file" | "folder";
export type FileItem = { name: string; type: FSType; path: string };

export type File = FileItem & { type: "file" };
export type Folder = FileItem & { type: "folder"; content: (File | Folder)[] };

// local storage simulation
const root: Folder = {
  name: "root",
  type: "folder",
  path: "/root",
  content: [
    { name: "file1.txt", type: "file", path: "/root/file1.txt" },
    { name: "file2.txt", type: "file", path: "/root/file2.txt" },
    {
      name: "subfolder",
      type: "folder",
      path: "/root/subfolder",
      content: [
        {
          name: "subfile1.txt",
          type: "file",
          path: "/root/subfolder/subfile1.txt",
        },
        {
          name: "subfile2.txt",
          type: "file",
          path: "/root/subfolder/subfile2.txt",
        },
      ],
    },
  ],
};
export async function getRoot() {
  const rootLocal = await localforage.getItem<Folder>("root");

  console.debug("Getting root folder", rootLocal);

  if (rootLocal) return rootLocal;
  localforage.setItem("root", root);

  return JSON.parse(JSON.stringify(root));
}

export async function addItem(path: string, item: File | Folder) {
  console.debug("Adding item", item, "to path", path);

  const rootLocal = await localforage.getItem<Folder>("root");
  if (!rootLocal) {
    console.error("Folder not found for path", path);
    return;
  }

  const folder = findFolderByPath(path, rootLocal);
  if (!folder) console.error("Folder not found for path", path);
  else {
    folder.content = [...folder.content, item];
    await localforage.setItem("root", rootLocal);
  }
}

export async function moveItem(path: string, newPath: string) {
  console.debug("Moving item from", path, "to", newPath);

  const rootLocal = await localforage.getItem<Folder>("root");
  if (!rootLocal) {
    console.error("Root not found", path);
    return;
  }

  const fsItem = findItemByPath(path, rootLocal);
  const parentFolder = findFolderByPath(
    path.slice(0, path.lastIndexOf("/")),
    rootLocal,
  );
  if (!fsItem || !parentFolder) {
    console.error("FS item not found for path", path);
    return;
  }
  parentFolder.content = parentFolder.content.filter(
    (item) => item.path !== path,
  );
  const newParentFolder = findFolderByPath(newPath, rootLocal);
  if (!newParentFolder) {
    console.error("New parent folder not found for path", newPath);
    return;
  }
  newParentFolder.content = [...newParentFolder.content, fsItem];

  updateItemPath(fsItem, newPath);

  await localforage.setItem("root", rootLocal);
}

export async function reset() {
  await localforage.setItem("root", root);
}

function findItemByPath(
  path: string,
  folder: Folder | File,
): Folder | File | null {
  if (folder.path === path) {
    return folder;
  } else if (folder.type === "folder") {
    for (const contentItem of folder.content) {
      const found = findItemByPath(path, contentItem);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

function findFolderByPath(path: string, folder: Folder): Folder | null {
  const item = findItemByPath(path, folder);
  if (item && item.type === "folder") {
    return item;
  }
  return null;
}

function updateItemPath(item: Folder | File, newPath: string) {
  item.path = newPath + "/" + item.name;
  if (item.type === "folder")
    for (const contentItem of item.content) {
      updateItemPath(contentItem, item.path);
    }
}
