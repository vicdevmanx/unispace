import { de } from "zod/v4/locales";
import WorkspaceListing from "../components/workspace-listing";
import WorkspaceLayout from "../workspace-layout";

const WorkspaceService = () => {



  return (
  <WorkspaceLayout>
    <WorkspaceListing />
  </WorkspaceLayout>)
};

export default WorkspaceService;
