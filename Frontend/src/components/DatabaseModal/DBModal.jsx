import React, { useState } from "react";
import { toast } from "react-toastify";
import { HTTP } from "../../utils";
import "../../assets/css/modal.css";

const DBModal = ({ handleClose }) => {
  const [databaseType, setDatabaseType] = useState("Blazegraph");
  const [namespace, setNamespace] = useState("");
  const [port, setPort] = useState("9999");
  const [minMemory, setMinMemory] = useState("");
  const [maxMemory, setMaxMemory] = useState("");
  const [installationPath, setInstallationPath] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!databaseType || !installationPath || !namespace) {
      toast.error(
        "Please select the database type, provide the installation path, and enter a namespace."
      );
      return;
    }

    const data = {
      namespace,
      properties: {
        "com.bigdata.rdf.store.DataLoader":
          "com.bigdata.rdf.data.RDFDataLoader",
        "com.bigdata.rdf.store.DataLoader.context":
          "com.bigdata.rdf.data.RDFDataLoaderContext",
        "com.bigdata.rdf.sail.isolates": "true",
        "com.bigdata.rdf.sail.quads": "true",
        "com.bigdata.rdf.sail.axioms": "true",
        "com.bigdata.rdf.sail.includeInferred": "true",
        "com.bigdata.rdf.sail.incremental": "false",
      },
      port,
      minMemory,
      maxMemory,
      installationPath,
    };

    setLoading(true);

    try {
      const response = await HTTP.post("/create_namespace/", data, {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          Accept: "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Database created successfully.");
        handleClose(); // Close the modal on success
      } else {
        console.error("Unexpected response:", response);
        toast.error("Failed to create the database. Please try again.");
      }
    } catch (error) {
      console.error("There was an error creating the database:", error);
      if (error.response && error.response.data) {
        toast.error(`Error: ${error.response.data.detail || "Unknown error"}`);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFolderChoose = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setInstallationPath(file.webkitRelativePath || file.path || file.name);
    }
  };

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        <p className="text-muted">
          To create a new database, select the database type, provide the installation path, and enter a namespace. Optionally, you can specify memory usage.
        </p>

        <h6>Required</h6>
        <div className="mb-3 row align-items-center">
          <label htmlFor="databaseType" className="col-sm-3 col-form-label">
            Database Type
          </label>
          <div className="col-sm-3">
            <select
              id="databaseType"
              className="form-select"
              value={databaseType}
              onChange={(e) => setDatabaseType(e.target.value)}
            >
              <option value="">Select Database Type</option>
              <option value="Blazegraph">Blazegraph</option>
            </select>
          </div>
        </div>

        <div className="mb-3 row align-items-center">
          <label htmlFor="namespace" className="col-sm-3 col-form-label">
            Namespace
          </label>
          <div className="col-sm-9">
            <input
              type="text"
              id="namespace"
              className="form-control"
              value={namespace}
              onChange={(e) => setNamespace(e.target.value)}
              placeholder="Enter namespace"
            />
          </div>
        </div>

        <div className="mb-3 row align-items-center">
          <label htmlFor="installationPath" className="col-sm-3 col-form-label">
            Installation Path
          </label>
          <div className="col-sm-9">
            <div className="input-group">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleFolderChoose}
              >
                Choose folder
              </button>
              <input
                type="text"
                id="installationPath"
                className="form-control"
                value={installationPath}
                onChange={(e) => setInstallationPath(e.target.value)}
                placeholder="Enter or select installation path"
                readOnly
              />
            </div>
          </div>
        </div>

        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          webkitdirectory=""
          onChange={handleFileChange}
        />

        <div className="mb-3 row align-items-center">
          <label htmlFor="port" className="col-sm-3 col-form-label">
            Port
          </label>
          <div className="col-sm-3">
            <input
              type="text"
              id="port"
              className="form-control"
              value={port}
              onChange={(e) => setPort(e.target.value)}
            />
          </div>
        </div>

        <h6>Optional</h6>
        <div className="mb-3 row align-items-center">
          <label htmlFor="minMemory" className="col-sm-5 col-form-label">
            Minimum Memory Usage (-Xms)
          </label>
          <div className="col-sm-3">
            <input
              type="text"
              id="minMemory"
              className="form-control"
              value={minMemory}
              onChange={(e) => setMinMemory(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-3 row align-items-center">
          <label htmlFor="maxMemory" className="col-sm-5 col-form-label">
            Maximum Memory Usage (-Xmx)
          </label>
          <div className="col-sm-3">
            <input
              type="text"
              id="maxMemory"
              className="form-control"
              value={maxMemory}
              onChange={(e) => setMaxMemory(e.target.value)}
            />
          </div>
        </div>

        <div className="d-flex justify-content-center mt-5">
          <button type="submit" className="btn btn-primary w-50" disabled={loading}>
            {loading ? "Creating..." : "Create Database"}
          </button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default DBModal;
