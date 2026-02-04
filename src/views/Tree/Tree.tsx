import { Form, useLoaderData } from "react-router-dom";
import { Branch } from "../../component/Branch/Branch";
import { type Folder } from "../../dataClient/folders";

export function Tree() {
  const { root } = useLoaderData<{ root: Folder }>();

  return (
    <div style={{ display: "flex" }}>
      <Branch folder={root} />

      <Form method="post" style={{ marginLeft: "auto", alignSelf: "end" }}>
        <h3>Reset Folder Structure</h3>
        <button type="submit" name="type" value="reset">
          Reset
        </button>
      </Form>
    </div>
  );
}
