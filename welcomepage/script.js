fetch("https://mentora-2-at9b.onrender.com/student/test")
  .then(res => res.text())
  .then(data => console.log("Server Response:", data))
  .catch(err => console.error("Error:", err));
