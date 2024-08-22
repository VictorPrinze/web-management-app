import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { CiCirclePlus } from "react-icons/ci";
import BModal from "./BModal/BModal";
import DBModal from "./DatabaseModal/DBModal";
import RepositoryModal from "./DatabaseModal/RepositoryModal";
import { HTTP } from "../utils";

const MainContent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenRepository, setIsOpenRepository] = useState(false);
  const [activeDatabase, setActiveDatabase] = useState(null);
  const [activeRepositories, setActiveRepositories] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchActiveDatabase();
    fetchActiveRepositories();
  }, []);

  const fetchActiveDatabase = async () => {
    setIsLoading(true);
    try {
      const response = await HTTP.get("/active-database/");
      console.log("Active database response:", response.data);
      setActiveDatabase(response.data.active_database);
    } catch (error) {
      console.error("Error fetching active database:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActiveRepositories = async () => {
    try {
      const response = await HTTP.get("/active-repository/");
      console.log("Active repositories response:", response.data);
      setActiveRepositories(response.data.active_repositories);
    } catch (error) {
      console.error("Error fetching active repositories:", error);
    }
  };

  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  const handleCloseRepository = () => setIsOpenRepository(false);
  const handleOpenRepository = () => setIsOpenRepository(true);

  const handleDatabaseCreated = () => {
    fetchActiveDatabase();
    handleClose();
  };

  return (
    <React.Fragment>
      <div className="container p-4">
        <Navbar />
        <div className="mb-4">
          <h3 className="mb-3">
            Active Database Information{" "}
            <CiCirclePlus
              onClick={handleOpen}
              style={{ cursor: "pointer" }}
            />
          </h3>

          {isLoading ? (
            <p>Loading...</p>
          ) : activeDatabase ? (
            <div className="shadow-sm p-3 mb-5 bg-body rounded">
              <div className="card-body" style={{ height: "20vh" }}>
                <h5>Database Name: {activeDatabase}</h5>
              </div>
            </div>
          ) : (
            <div className="shadow-sm p-3 mb-5 bg-body rounded">
              <div className="card-body" style={{ height: "20vh" }}>
                No active database found.
              </div>
            </div>
          )}
        </div>
        <div>
          <h3>
            Repositories{" "}
            <CiCirclePlus
              onClick={handleOpenRepository}
              style={{ cursor: "pointer" }}
            />
          </h3>

          {activeRepositories && activeRepositories.length > 0 ? (
            <div className="shadow-sm p-3 mb-5 bg-body rounded">
              <div className="card-body" style={{ height: "20vh" }}>
                <h5>Active Repositories:</h5>
                <ul>
                  {activeRepositories.map((repo, index) => (
                    <li key={index}>{repo}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="shadow-sm p-3 mb-5 bg-body rounded">
              <div className="card-body" style={{ height: "20vh" }}>
                No active repositories found.
              </div>
            </div>
          )}
        </div>
      </div>

      <BModal
        show={isOpen}
        onHide={handleClose}
        backdrop="static"
        title="Create a new database"
        keyboard={false}
        size="lg"
      >
        <DBModal handleClose={handleClose} onDatabaseCreated={handleDatabaseCreated} />
      </BModal>

      <BModal
        show={isOpenRepository}
        onHide={handleCloseRepository}
        backdrop="static"
        title="Connect with the existing database"
        keyboard={false}
        size="lg"
      >
        <RepositoryModal handleCloseRepository={handleCloseRepository} />
      </BModal>
    </React.Fragment>
  );
};

export default MainContent;