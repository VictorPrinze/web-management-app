import { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Navbar from "./Navbar";
import "../assets/css/FileUpload.css";
import { HTTP } from "../utils";
import { toast } from "react-toastify";
import allImages from "../constant/images";

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [showFileList, setShowFileList] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(-1);
  const [error, setError] = useState("");

  const fetchFiles = async () => {
    try {
      const response = await HTTP.get("/files", {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        withCredentials: true,
      });
      setFiles(response.data.files);
    } catch (error) {
      console.error("There was an error fetching the files!", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? -1 : index);
  };

  const handleSelect = (index) => {
    let newFiles = [...files];
    newFiles[index].selected = !newFiles[index].selected;
    setFiles(newFiles);
  };

  const handleDelete = (index) => {
    let newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleGraphIdChange = (index, graphId) => {
    let newFiles = [...files];
    newFiles[index].graphId = graphId;
    setFiles(newFiles);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const allowedExtensions = ["ttl", "rdf", "xml", "nt", "jsonld"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (allowedExtensions.includes(fileExtension)) {
      const fileSize = file.size;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("size", fileSize);
      formData.append("graph_id", "none");

      try {
        await HTTP.post("/upload/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-Requested-With": "XMLHttpRequest",
            Accept: "application/json",
          },
        });
        toast.success(`File ${file.name} uploaded successfully.`);
        fetchFiles();
        setShowFileList(true);
      } catch (error) {
        console.error("There was an error uploading the file!", error);
        setError("Error uploading file. Please try again.");
      }
    } else {
      setError(
        "Invalid file type. Allowed types are: .ttl, .rdf, .xml, .nt, .jsonld"
      );
    }
  };

  const handleImportClick = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div className="container p-5">
      <Navbar />
      <div className="shadow-sm p-4 mb-5 bg-body rounded">
        {showFileList && files.length > 0 && (
          <div>
            <h5>File Upload:</h5>
            <ul>
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        <input
          type="file"
          accept=".ttl,.rdf,.xml,.nt,.jsonld"
          onChange={handleFileUpload}
          className="form-control mb-4"
          id="fileInput"
          style={{ display: "none" }}
        />

        <button className="btn btn-primary mb-4" onClick={handleImportClick}>
          Import
        </button>

        {error && <p className="text-danger">{error}</p>}

        {files.length === 0 ? (
          <p className="text-center text-danger fw-bolder text-uppercase">
            No record found
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col" className="text-muted">
                  File
                </th>
                <th scope="col" className="text-muted">
                  Named Graph ID
                </th>
                <th scope="col" className="text-muted">
                  File size
                </th>
                <th scope="col" className="text-muted">
                  Delete
                </th>
                <th scope="col" className="text-muted">
                  Import
                </th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={file.selected}
                      onChange={() => handleSelect(index)}
                    />
                  </td>
                  <td>{file.name}</td>
                  <td>
                    <Dropdown
                      isOpen={dropdownOpen === index}
                      toggle={() => toggleDropdown(index)}
                    >
                      <DropdownToggle
                        caret
                        className="custom-dropdown-toggle text-capitalize"
                      >
                        {file.graph_id}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem
                          onClick={() => handleGraphIdChange(index, "graph1")}
                        >
                          graph1
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => handleGraphIdChange(index, "graph2")}
                        >
                          graph2
                        </DropdownItem>

                        <DropdownItem
                          onClick={() => handleGraphIdChange(index, "추가")}
                        >
                          추가
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </td>
                  <td>{file.size}</td>
                  <td>
                    <p onClick={() => handleDelete(index)}>
                      <img src={allImages.cancel} alt="" />
                    </p>
                  </td>
                  <td>
                    <p onClick={() => handleImportClick(index)}>
                      <img src={allImages.download} alt="" />
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
