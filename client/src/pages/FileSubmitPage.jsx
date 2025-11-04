import React from 'react'

function FileSubmit() {

    const [status, setStatus] = useState("");
    const [file, setFile] = useState(null);
    
    async function fileSubmit(e) {
        e.preventDefault();

        if (!file) {
            setStatus("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("photo", file);

        try {
            const response = await fetch("http://localhost:5000/upload/photo", {
                method: "POST",
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

export default FileSubmit