import React from "react";

import { de } from "zod/v4/locales";
import WorkspaceListing from "../components/workspace-listing";
import WorkspaceLayout from "../workspace-layout";
import WorkspaceCta from "../components/workspace-cta";
import CreateBooking from "../components/CreateBooking";

const WorkspaceService = () => {



  return (
    <WorkspaceLayout>
      <WorkspaceCta />
      <CreateBooking/>
    </WorkspaceLayout>
  );
};

export default WorkspaceService;