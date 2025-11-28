import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function UploadPage() {
    const navigate = useNavigate();

    const [status, setStatus] = useState("");
    const [file, setFile] = useState(null);
    const homeButtonText = "<< Home"

    async function fileSubmit(e) {
        e.preventDefault();

        if (!file) {
            setStatus("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:5000/data/upload", {
                method: "POST",
                headers: {
                    authorization: localStorage.getItem("token") || "",
                },
                body: formData
            });

            if (!response.ok) {
                setStatus("Error: upload unsuccessful!")
                return;
            }
            const data = await response.text()
            console.log(data)
            setStatus(data)

        } catch (e) {
            console.log(e.message)
            setStatus("Error: upload unsuccessful!")
            return;

        }

    }

    // FIXME: it will pull some datas needed for the page in the future like space used and stuff
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
                    setStatus("Please log in first!");
                    return;
                }

            } catch (err) {
                console.error(err);
                setStatus("Error loading data.");
            }
        }

        dataLoader();
    }, [])
    return (

        <div>
            <div>
                <button onClick={() => navigate("/home")}>
                    {homeButtonText}
                </button>
            </div>
            <form onSubmit={fileSubmit}>
                <h2>Upload a File</h2>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
                <br />
                <button type="submit">Upload</button>
                {status && <p>{status}</p>}
            </form>
        </div>
    )
}

export default UploadPage