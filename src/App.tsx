import { ProjectList } from "./pages/projects/list";
import { ProjectCreate } from "./pages/projects/create";
import { ProjectEdit } from "./pages/projects/edit";
import { ExperienceList } from "./pages/experiences/list";
import { ExperienceCreate } from "./pages/experiences/create";
import { ExperienceEdit } from "./pages/experiences/edit";
import { SkillList } from "./pages/skills/list";
import { SkillCreate } from "./pages/skills/create";
import { SkillEdit } from "./pages/skills/edit";
import { EducationList } from "./pages/educations/list";
import { EducationCreate } from "./pages/educations/create";
import { EducationEdit } from "./pages/educations/edit";
import { AchievementList } from "./pages/achievements/list";
import { AchievementCreate } from "./pages/achievements/create";
import { AchievementEdit } from "./pages/achievements/edit";
import { Authenticated, GitHubBanner, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import { dataProvider, liveProvider } from "@refinedev/supabase";
import { supabaseClient } from "./utility";
import { authProvider } from "./authProvider";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { AntdInferencer } from "@refinedev/inferencer/antd"; 

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <AntdApp>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider(supabaseClient)}
              liveProvider={liveProvider(supabaseClient)}
              authProvider={authProvider}
              routerProvider={routerBindings}
              notificationProvider={useNotificationProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "portfolio-admin",
              }}
              resources={[
                {
                  name: "projects",
                  list: "/projects",
                  create: "/projects/create",
                  edit: "/projects/edit/:id",
                  show: "/projects/show/:id",
                  meta: { label: "Projects" },
                },
                {
                  name: "experiences",
                  list: "/experiences",
                  create: "/experiences/create",
                  edit: "/experiences/edit/:id",
                  show: "/experiences/show/:id",
                  meta: { label: "Experience" },
                },
                {
                  name: "skills",
                  list: "/skills",
                  create: "/skills/create",
                  edit: "/skills/edit/:id",
                  show: "/skills/show/:id",
                  meta: { label: "Skills" },
                },
                {
                  name: "educations",
                  list: "/educations",
                  create: "/educations/create",
                  edit: "/educations/edit/:id",
                  show: "/educations/show/:id",
                  meta: { label: "Education" },
                },
                {
                  name: "achievements",
                  list: "/achievements",
                  create: "/achievements/create",
                  edit: "/achievements/edit/:id",
                  show: "/achievements/show/:id",
                  meta: { label: "Achievements" },
                },
              ]}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-inner"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <ThemedLayoutV2 Sider={ThemedSiderV2}>
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route
                    index
                    element={<NavigateToResource resource="projects" />}
                  />
                  
                  <Route path="/projects">
                    <Route index element={<ProjectList />} />
                    <Route path="create" element={<ProjectCreate />} />
                    <Route path="edit/:id" element={<ProjectEdit />} />
                    <Route path="show/:id" element={<AntdInferencer />} />
                  </Route>

                  <Route path="/experiences">
                    <Route index element={<ExperienceList />} />
                    <Route path="create" element={<ExperienceCreate />} />
                    <Route path="edit/:id" element={<ExperienceEdit />} />
                    <Route path="show/:id" element={<AntdInferencer />} />
                  </Route>

                  <Route path="/skills">
                    <Route index element={<SkillList />} />
                    <Route path="create" element={<SkillCreate />} />
                    <Route path="edit/:id" element={<SkillEdit />} />
                    <Route path="show/:id" element={<AntdInferencer />} />
                  </Route>

                  <Route path="/educations">
                    <Route index element={<EducationList />} />
                    <Route path="create" element={<EducationCreate />} />
                    <Route path="edit/:id" element={<EducationEdit />} />
                    <Route path="show/:id" element={<AntdInferencer />} />
                  </Route>

                  <Route path="/achievements">
                    <Route index element={<AchievementList />} />
                    <Route path="create" element={<AchievementCreate />} />
                    <Route path="edit/:id" element={<AchievementEdit />} />
                    <Route path="show/:id" element={<AntdInferencer />} />
                  </Route>

                  <Route path="*" element={<ErrorComponent />} />
                </Route>
                
                <Route
                  element={
                    <Authenticated
                      key="authenticated-outer"
                      fallback={<Outlet />}
                    >
                      <NavigateToResource />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<AuthPage type="login" />} />
                </Route>
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </AntdApp>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

import { AuthPage } from "@refinedev/antd";

export default App;