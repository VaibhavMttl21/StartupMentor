

export const sendEmail = async () => {
    fetch("https://us-central1-startupfinder-c931d.cloudfunctions.net/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: "rudramittal24@gmail.com",
          subject: "Will it work",
          text: "If you get this email means it working"
        })
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error("Error:", error));
  };