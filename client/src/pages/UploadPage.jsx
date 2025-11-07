import { useState } from 'react'

function UploadPage() {

    // FIXME: auth check before loading the page otherwise navigate to authpage

    const [status, setStatus] = useState("");
    const [file, setFile] = useState(null);
    
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
    return (

        <div>
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