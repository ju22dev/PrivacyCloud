import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();

    const [downloadLinks, setDownloadLinks] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [fileName, setFileName] = useState([]);

    // FIXME: temp solution
    async function handleOpenFile(link) {
        const token = localStorage.getItem('token');
        window.open(`${link}?token=${token}`, '_blank');
    }


    useEffect(() => {
        
        async function dataLoader() {
            try {
                const response = await fetch("http://localhost:5000/data/download", {
                    headers: {
                        authorization: localStorage.getItem("token"),
                    },
                });

                const data = await response.json();
                console.log(data);

                if (data.message && data.message.includes("Invalid token")) {
                    navigate("/auth");
                    setErrorMessage("Please log in first!");
                    return;
                }

                setDownloadLinks(data.userData || []);
                data.userData.map((t, k) => {
                    setFileName(prev => [...prev, t.split("/").at(-1).slice(0,10)+"\n"+t.split("/").at(-1).slice(10,20)])
                })
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
                    
                    <li key={i} className="fileElement" onClick={() => handleOpenFile(link)}>
                        <img src="/icons8-file.svg" alt="" />
                        
                        <p>{fileName[i]}</p>
                    </li>
                ))}
            </div>

            <button onClick={() => navigate("/upload")}>
                + Upload
            </button>
        </div>
    );

}

export default HomePage;
