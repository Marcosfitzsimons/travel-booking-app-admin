import { ReactElement } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import Login from "./pages/Login";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import Publications from "./pages/Publications";
import NewTrip from "./pages/NewTrip";
import NewUser from "./pages/NewUser";
import SingleUser from "./pages/SingleUser";
import List from "./pages/List";
import { publicationInputs, tripInputs, specialTripInputs } from "./formSource";
import {
  tripColumns,
  userColumns,
  specialTripColumns,
} from "./datatablesource";
import SingleTrip from "./pages/SingleTrip";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import NewPassenger from "./pages/NewPassenger";
import SinglePublication from "./pages/SinglePublication";
import NewPublication from "./pages/NewPublication";
import SingleSpecialTrip from "./pages/SingleSpecialTrip";
import NewSpecialTrip from "./pages/NewSpecialTrip";
import { Map, Users } from "lucide-react";
import YearlyIncomes from "./pages/YearlyIncomes";
import useAuth from "./hooks/useAuth";
import PersistLogin from "./components/PersistLogin";
import Dashboard from "./pages/Dashboard";
import PredefinedTrips from "./pages/PredefinedTrips";
import MonthlyIncomes from "./pages/MonthlyIncomes";

type Props = {
  children: ReactElement;
};

function App() {
  const { auth } = useAuth();
  const user = auth?.user;

  const ProtectedRoute = ({ children }: Props) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <div className="w-full flex text-foreground">
      <SideBar />
      <div
        className={`flex-[6] min-w-[330px] px-2 lg:px-10 lg:pr-20 ${
          user ? "lg:border-l" : ""
        }`}
      >
        <Header />
        <main className="py-2">
          <Routes>
            <Route path="/">
              <Route path="login" element={<Login />} />
              <Route element={<PersistLogin />}>
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="yearly">
                  <Route
                    index
                    element={
                      <ProtectedRoute>
                        <YearlyIncomes />
                      </ProtectedRoute>
                    }
                  />
                </Route>
                <Route path="monthly">
                  <Route
                    index
                    element={
                      <ProtectedRoute>
                        <MonthlyIncomes />
                      </ProtectedRoute>
                    }
                  />
                </Route>
                <Route path="users">
                  <Route
                    index
                    element={
                      <ProtectedRoute>
                        <List
                          icon={<Users className="w-5 h-5 text-accent" />}
                          columns={userColumns}
                          title="Usuarios"
                          linkText="Agregar usuario"
                        />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path=":id"
                    element={
                      <ProtectedRoute>
                        <SingleUser />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="new"
                    element={
                      <ProtectedRoute>
                        <NewUser title="Crear nuevo usuario" />
                      </ProtectedRoute>
                    }
                  />
                </Route>
                <Route path="trips">
                  <Route
                    index
                    element={
                      <ProtectedRoute>
                        <List
                          icon={<Map className="w-5 h-5 text-accent" />}
                          columns={tripColumns}
                          title="Viajes semanales"
                          linkText="Agregar viaje"
                        />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path=":id"
                    element={
                      <ProtectedRoute>
                        <SingleTrip />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="new"
                    element={
                      <ProtectedRoute>
                        <NewTrip
                          inputs={tripInputs}
                          title="Crear nuevo viaje semanal"
                        />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="predefined-trips">
                    <Route
                      index
                      element={
                        <ProtectedRoute>
                          <PredefinedTrips />
                        </ProtectedRoute>
                      }
                    />
                  </Route>
                </Route>
                <Route path="special-trips">
                  <Route
                    index
                    element={
                      <ProtectedRoute>
                        <List
                          icon={<Map className="w-5 h-5 text-accent" />}
                          columns={specialTripColumns}
                          title="Viajes particulares"
                          linkText="Agregar viaje particular"
                        />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path=":id"
                    element={
                      <ProtectedRoute>
                        <SingleSpecialTrip />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="new"
                    element={
                      <ProtectedRoute>
                        <NewSpecialTrip
                          inputs={specialTripInputs}
                          title="Crear nuevo viaje particular"
                        />
                      </ProtectedRoute>
                    }
                  />
                </Route>
                <Route path="passengers">
                  <Route
                    path="newPassenger/:id"
                    element={
                      <ProtectedRoute>
                        <NewPassenger
                          title="Agregar pasajero"
                          columns={userColumns}
                        />
                      </ProtectedRoute>
                    }
                  />
                </Route>
                <Route path="publications">
                  <Route
                    index
                    element={
                      <ProtectedRoute>
                        <Publications />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path=":id"
                    element={
                      <ProtectedRoute>
                        <SinglePublication />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="new"
                    element={
                      <ProtectedRoute>
                        <NewPublication
                          inputs={publicationInputs}
                          title="Crear nueva publicación"
                        />
                      </ProtectedRoute>
                    }
                  />
                </Route>
                <Route
                  path="/mi-perfil"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mi-perfil/editar-perfil"
                  element={
                    <ProtectedRoute>
                      <EditProfile />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
          </Routes>
        </main>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
