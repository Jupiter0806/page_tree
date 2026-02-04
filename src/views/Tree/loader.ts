import {
  addItem,
  getRoot,
  type Folder,
  type File,
  moveItem,
  reset,
} from "../../dataClient/folders";

export async function loader() {
  const root = await getRoot();
  return { root };
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const path = data.path as string;
  const newPath = data.newPath as string;

  if (data.type === "reset") {
    await reset();
    return;
  }

  if (data.type === "move" && newPath) {
    await moveItem(path, newPath);
    return;
  }

  let item: File | Folder;

  if (data.type === "file") {
    item = {
      name: data.name as string,
      type: "file",
      path: `${path}/${data.name as string}`,
    };
  } else {
    item = {
      name: data.name as string,
      type: "folder",
      path: `${path}/${data.name as string}`,
      content: [],
    };
  }
  await addItem(path, item);
}
