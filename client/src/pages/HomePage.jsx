import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();

    const [downloadLinks, setDownloadLinks] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [fileName, setFileName] = useState([]);
    const [fileIds, setFileIds] = useState([]);
    const [open, setOpen] = useState({});

    async function handleOpenFile(link) {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${link}?token=${token}`);

            if (!response.ok) {
                throw new Error("Failed to fetch file from server");
            }

            const encryptedBlob = await response.blob();

            const result = await fileDecrypt(encryptedBlob);

            if (!result.success) {
                throw new Error(`Decryption failed: ${result.error}`);
            }

            const filename = link.split('/').pop().replace('.enc', '');

            // Create a download link for the decrypted file
            const url = URL.createObjectURL(result.blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);

        } catch (e) {
            window.alert(e.message);
        }
    }

    async function fileDecrypt(encryptedFile) {
        try {
            // Read the encrypted file as ArrayBuffer
            const fileBuffer = await encryptedFile.arrayBuffer();
            const fileData = new Uint8Array(fileBuffer);

            const headerBytes = fileData.slice(0, 2);
            const byte1 = headerBytes[0].toString(2).padStart(8, "0");
            const byte2 = headerBytes[1].toString(2).padStart(8, "0");
            const fullHeader = byte1 + byte2;

            const strengthBits = fullHeader.slice(4, 6);
            const indexBits = fullHeader.slice(6, 16);

            let strength;
            switch (strengthBits) {
                case "00": strength = 128; break;
                case "01": strength = 256; break;
                case "10": strength = 512; break;
                case "11": strength = 1024; break;
                default:
                    throw new Error("Invalid encryption strength in header");
            }

            const keyPos = parseInt(indexBits, 2);

            // Get pool from localStorage
            // FIXME : I will add a way for the user to upload the secretpoolkey.txt file.
            const poolHex = localStorage.getItem("poolHex");
            if (!poolHex) {
                throw new Error("No encryption key pool found. Please upload your secretpoolkey.txt file.");
            }

            const pool = new Uint8Array(poolHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

            const rawKey = pool.slice(keyPos, keyPos + (strength / 8));

            // Import the key
            const cryptoKey = await window.crypto.subtle.importKey(
                "raw",
                rawKey,
                { name: "AES-GCM" },
                false,
                ["decrypt"]
            );

            // Extract IV 
            const iv = fileData.slice(2, 14);

            // Extract the actual encrypted data 
            const encryptedData = fileData.slice(14);

            // Decrypt the data
            const decryptedData = await window.crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: iv
                },
                cryptoKey,
                encryptedData
            );

            // Create a blob with the decrypted data
            const decryptedBlob = new Blob([decryptedData]);

            return {
                success: true,
                blob: decryptedBlob,
                strength: strength
            };

        } catch (error) {
            console.error("Decryption error:", error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async function handleDeleteFile(fileId) {
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_BASEURL + `/data/delete/${fileId}`, {
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
                const response = await fetch(import.meta.env.VITE_BACKEND_BASEURL + "/data/download", {
                    headers: {
                        authorization: localStorage.getItem("token"),
                        "ngrok-skip-browser-warning": true,

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
                    downloads.push(import.meta.env.VITE_BACKEND_BASEURL + `/data/file/${t.dataName}`);
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
