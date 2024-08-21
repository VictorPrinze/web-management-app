import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { CiCirclePlus } from "react-icons/ci";
import BModal from "./BModal/BModal";
import DBModal from "./DatabaseModal/DBModal";
import RepositoryModal from "./DatabaseModal/RepositoryModal";
import { HTTP } from "../utils";

const MainContent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  const [isOpenRepository, setIsOpenRepository] = useState(false);
  const handleCloseRepository = () => setIsOpenRepository(false);
  const handleOpenRepository = () => setIsOpenRepository(true);

  const [activeDatabase, setActiveDatabase] = useState(null);
  const [activeRepository, setActiveRepository] = useState(null);

  useEffect(() => {
    fetchActiveDatabase();
    fetchActiveRepository();
  }, []);

  const fetchActiveDatabase = async () => {
    try {
      const response = await HTTP.get("/active-database/");
      setActiveDatabase(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchActiveRepository = async () => {
    try {
      const response = await HTTP.get("/active-repository/");
      setActiveRepository(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewDatabase = () => {
    handleOpen();
  };

  const handleNewRepository = () => {
    handleOpenRepository();
  };

  return (
    <React.Fragment>
      <div className="container p-4">
        <Navbar />
        <div className="mb-4">
          <h3 className="mb-3">
            Active Database Information{" "}
            <CiCirclePlus
              onClick={() => handleNewDatabase()}
              style={{ cursor: "pointer" }}
            />
          </h3>

          {activeDatabase ? (
            <div className="shadow-sm p-3 mb-5 bg-body rounded">
              <div className="card-body" style={{ height: "20vh" }}>
                <h5>Database Name: {activeDatabase.name}</h5>
                <p>Database Description: {activeDatabase.description}</p>
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
            Repository{" "}
            <CiCirclePlus
              onClick={() => handleNewRepository()}
              style={{ cursor: "pointer" }}
            />
          </h3>

          {activeRepository ? (
            <div className="shadow-sm p-3 mb-5 bg-body rounded">
              <div className="card-body" style={{ height: "20vh" }}>
                <h5>Repository Name: {activeRepository.name}</h5>
                <p>Repository Description: {activeRepository.description}</p>
              </div>
            </div>
          ) : (
            <div className="shadow-sm p-3 mb-5 bg-body rounded">
              <div className="card-body" style={{ height: "20vh" }}>
                No active repository found.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for creating a new database */}
      <BModal
        show={isOpen}
        onHide={handleClose}
        backdrop="static"
        title="Create a new database"
        keyboard={false}
        size="lg"
      >
        <DBModal handleClose={handleClose} />
      </BModal>

      {/* Modal for connecting an existing database */}
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
