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

        // Check if pool exists in localStorage
        let poolHex = localStorage.getItem("poolHex");
        let pool;

        if (poolHex === null) {
            // Generate new pool: 1 kilobit = 1024 bits = 128 bytes
            pool = new Uint8Array(128);
            window.crypto.getRandomValues(pool);

            // Convert to hex
            poolHex = "";
            pool.forEach((val) => {
                poolHex += val.toString(16).padStart(2, "0");
            });
            
            // Save to localStorage
            localStorage.setItem("poolHex", poolHex);

            // Download the pool key file
            const blob = new Blob([poolHex], { type: "text/plain" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "secretpoolkey.txt";
            a.click();
            URL.revokeObjectURL(url);

            setStatus("New key pool generated and downloaded!");
        } else {
            // Convert existing hex string back to Uint8Array
            pool = new Uint8Array(poolHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
            setStatus("Using existing key pool from localStorage.");
        }

        // ask the user to choose how strong the encryption should be (default 256 bit)
        let strength = Number(prompt("Encryption strength (128 / 192 / 256)", "256")) || 256;
        if (![128, 192, 256].includes(strength)) {
            setStatus("Invalid encryption strength.");
            strength = 256;
        }
        // generate a random starting point
        const maxPos = pool.length - (strength/8);
        const randomVal = new Uint32Array(1);
        window.crypto.getRandomValues(randomVal);
        const keyPos = randomVal[0] % maxPos;

        // extract the key from that starting point
        const rawKey = pool.slice(keyPos, keyPos + (strength/8));

        const cryptoKey = await window.crypto.subtle.importKey(
            "raw",
            rawKey,
            { name: "AES-GCM" },
            false,
            ["encrypt"]
        );

        // Read the file as ArrayBuffer
        const fileBuffer = await file.arrayBuffer();

        // Generate a random IV (Initialization Vector) for AES-GCM
        const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 12 bytes for GCM

        // Encrypt the file data
        const encryptedData = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            cryptoKey,
            fileBuffer
        );

        // Combine IV and encrypted data into a single blob
        // The IV needs to be stored with the encrypted data so it can be used for decryption
        const encryptedBlob = new Blob([iv, new Uint8Array(encryptedData)]);

        let strengthBits;
        switch (strength) {
            case 128: strengthBits = "00"; break;
            case 256: strengthBits = "01"; break;
            case 512: strengthBits = "10"; break;
            case 1024: strengthBits = "11"; break;
            default:
                setStatus("Unsupported key strength.");
                return;
        }

        const indexBits = keyPos.toString(2).padStart(10, "0");
        const header = strengthBits + indexBits;
        const fullHeader = header.padStart(16, "0");

        // Split into two 8-bit chunks
        const byte1 = parseInt(fullHeader.slice(0, 8), 2);   // First 8 bits
        const byte2 = parseInt(fullHeader.slice(8, 16), 2);  // Last 8 bits

        const headerBytes = new Uint8Array([byte1, byte2]);

        const finalBlob = new Blob([headerBytes, encryptedBlob], {
            type: "application/octet-stream"
        });

        formData.append("file", finalBlob, file.name + ".enc");


        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_BASEURL + "/data/upload", {
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
                const response = await fetch(import.meta.env.VITE_BACKEND_BASEURL + "/data/download", {
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