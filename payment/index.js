document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("receiptFile");
  const file = fileInput.files[0];
  const uploadStatus = document.getElementById("uploadStatus");
  const preview = document.getElementById("filePreview");

  if (!file) {
    alert("Please select a file first.");
    return;
  }

  // You can store StudentID in localStorage or pass it dynamically
  const studentId = localStorage.getItem("StudentID");
  console.log(studentId);
  const formData = new FormData();
  formData.append("receipt", file);
  formData.append("StudentID", studentId);

  uploadStatus.textContent = "Uploading...";
  uploadStatus.classList.remove("pending", "verified");
  uploadStatus.style.background = "#d7f0ff";
  uploadStatus.style.color = "#005b96";

  try {
    const res = await fetch("https://mentora-5.onrender.com/admin/paymentreciept/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      uploadStatus.textContent = "Uploaded";
      uploadStatus.classList.add("verified");
      uploadStatus.style.background = "#e0ffe7";
      uploadStatus.style.color = "#2b9348";

      // Preview file
      const reader = new FileReader();
      reader.onload = () => {
        preview.src = reader.result;
        preview.style.display = "block";
      };
      reader.readAsDataURL(file);

    } else {
      uploadStatus.textContent = "Failed";
      uploadStatus.classList.add("pending");
      uploadStatus.style.background = "#fff5d7";
      uploadStatus.style.color = "#be9500";
      alert(data.msg || "Upload failed");
    }
  } catch (err) {
    console.error(err);
    uploadStatus.textContent = "Error";
    uploadStatus.style.background = "#fff5d7";
    uploadStatus.style.color = "#be0000";
    alert("Server error. Check console.");
  }
});
