import { useState, useEffect } from 'react'

function App() {
    const [fname, setFname] = useState("John")
    const [lname, setLname] = useState("Doe")

    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("");

    async function textSubmit(e) {
        e.preventDefault();
        const res = await fetch("http://localhost:5000/name", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fname, lname }),
        });
        const data = await res.text();
        console.log(data);
    }

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

            if(!response.ok) {
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
        <>
            <nav>
                <li id='home'><a href="#">Privacy Cloud</a></li>
                <li className='sign'><button>Log In</button></li>
                <li className='sign'><a href="#">Sign Up</a></li>
                
            </nav>
            <br /><br /><br />
            <div>
            <form onSubmit={textSubmit}>
                <label htmlFor="fname">First name:</label><br></br>
                <input type="text" id="fname" name="fname" value={fname} onChange={(e) => setFname(e.target.value)}></input><br></br>
                <label htmlFor="lname">Last name:</label><br></br>
                <input type="text" id="lname" name="lname" value={lname} onChange={(e) => setLname(e.target.value)}></input><br></br><br></br>
                <button type="submit">Submit</button>
            </form>
            </div>

            <div>
                <form onSubmit={fileSubmit}>
                    <h2>Upload a File</h2>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
                    <br />
                    <button type="submit">Upload</button>
                    {status && <p>{status}</p>}
                </form>
            </div>
        
            

        </>

    )
}

export default App