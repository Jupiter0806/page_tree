export type File = { name: string; type: "file"; path: string };
export type Folder = {
  name: string;
  type: "folder";
  path: string;
};

export type Path = string;

const mockRoot: Record<Path, File | Folder> = {
  "/root": { name: "root", type: "folder", path: "/root" },
  "/root/file1.txt": {
    name: "file1.txt",
    type: "file",
    path: "/root/file1.txt",
  },
  "/root/file2.txt": {
    name: "file2.txt",
    type: "file",
    path: "/root/file2.txt",
  },
  "/root/subfolder": {
    name: "subfolder",
    type: "folder",
    path: "/root/subfolder",
  },
  "/root/subfolder/subfile1.txt": {
    name: "subfile1.txt",
    type: "file",
    path: "/root/subfolder/subfile1.txt",
  },
};

// Implement all functions in folders.ts, and replace it
