import { useState, useEffect } from "react";

function HomePage() {
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

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
          setErrorMessage("Please log in first!");
          return;
        }

        setDownloadLinks(data.userData || []);
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

      <ul>
        {downloadLinks.map((link, i) => (
          <li key={i}>
            <a href={link} target="_blank" rel="noopener noreferrer">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
