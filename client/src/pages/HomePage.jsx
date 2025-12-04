import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();

    const [downloadLinks, setDownloadLinks] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [fileName, setFileName] = useState([]);
    const [fileIds, setFileIds] = useState([]);
    const [open, setOpen] = useState({});

    // FIXME: temp solution
    async function handleOpenFile(link) {
        try {
            const token = localStorage.getItem("token");
            window.open(`${link}?token=${token}`, "_blank");

        } catch (e) {
            window.alert(e.message)
        }
    }

    async function handleDeleteFile(fileId) {
        try {
            // FIXME: there should be an api for delete that takes:
            //      file id
            const response = await fetch(`http://localhost:5000/data/delete/${fileId}`, {
                headers: {
                    authorization: localStorage.getItem("token"),
                },
            });
            console.log(response)
        } catch (e) {
            console.log(e.message)
        }

    }

    function changeOptionVisibility(id) {
        setOpen((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
        //FIXME: THE OTHER OPTIONS SHOULD BE AUTOMATICALLY CLOSED WHEN ANOTHER ONE IS OPENED.
    }

    
    useEffect(() => {
        async function dataLoader() {
            try {
                const response = await fetch("http://localhost:5000/data/download", {
                    headers: {
                        authorization: localStorage.getItem("token"),
                    },
                });
                //
                const data = await response.json();
                console.log(data);

                if (data.message && data.message.includes("Invalid token")) {
                    navigate("/auth");
                    setErrorMessage("Please log in first!");
                    return;
                } else if (data.message === "Your cloud storage is empty!") {
                    //FIXME: HANDLE THIS (PUT A NO FILE ICON DISPLAY AND ALL THAT)
                }

                const userData = data.userData;

                const downloads = [];
                const names = [];
                const ids = [];

                userData.forEach((t) => {
                    downloads.push(`http://localhost:5000/data/file/${t.dataName}`);
                    names.push(t.dataName.slice(0, 10) + "\n" + t.dataName.slice(10, 20));
                    ids.push(t.id);
                });

                setDownloadLinks(downloads);
                setFileName(names);
                setFileIds(ids);

            } catch (err) {
                console.error(err);
                setErrorMessage("Error loading data.");
            }
        }

        dataLoader();
    }, []);

    return (
        <div>
            <h1>HomePage</h1>

            {errorMessage && <h2>{errorMessage}</h2>}

            <div className="filesContainer">
                {downloadLinks.map((link, i) => (
                    <li
                        key={i}
                        className="fileElement"
                        onClick={() => handleOpenFile(link)}
                    >
                        <img src="/icons8-file.svg" alt="" />

                        <div className="fileDescription">
                            <p>{fileName[i]}</p>
                            <div
                                className="three-dots"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    changeOptionVisibility(i);
                                }}
                            >
                                <img src="./three-dots.svg" alt="" />
                                {open[i] && (
                                    <div className="drop-down-options">
                                        <ul>
                                            <li onClick={() => handleDeleteFile(fileIds[i])}>Delete</li>
                                            <li>Nothing</li>
                                        </ul>

                                    </div>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </div>

            <button onClick={() => navigate("/upload")}>+ Upload</button>
        </div>
    );
}

export default HomePage;
