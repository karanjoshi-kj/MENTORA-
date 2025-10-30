const statusValues = ["not-allocated", "partial", "paid", "approved"];

function updateStepper(status, student) {
  const steps = [
    { icon: "🔄", label: "Seat Allocation" },
    { icon: "💰", label: "Payment" },
    { icon: "✅", label: "Admin Approval" },
    { icon: "🧾", label: "Offer Letter" }
  ];
  const stepper = document.querySelector(".stepper-card .stepper");
  const stepStatusInfo = document.getElementById('stepMsg');
  const actionRow = document.getElementById('actionRow');

  let done = 0, active = 0;
  if (status === "not-allocated") { active = 0; }
  else if (status === "partial") { done = 1; active = 1; }
  else if (status === "paid") { done = 2; active = 2; }
  else if (status === "approved") { done = 4; active = 4; }

  stepper.querySelectorAll('.step').forEach((step, i) => {
    step.classList.remove("step--done", "step--active", "step--todo");
    if (i < done) step.classList.add("step--done");
    else if (i == done && status !== "approved") step.classList.add("step--active");
    else step.classList.add("step--todo");
    step.querySelector(".step-icon").innerHTML =
      (i < done) ? "&#10003;" : steps[i].icon;
  });

  actionRow.innerHTML = "";
  if (status === "not-allocated") {
    stepStatusInfo.textContent = "Waiting for seat to be allocated by admin/faculty.";
  } else if (status === "partial") {
    stepStatusInfo.textContent = "Seat conditionally allocated. Please complete your payment to proceed.";
    // Add Pay Fees button (primary), Receipt section (secondary)
    let payBtn = `<button class="action-btn" id="payFeesBtn" onclick="paymentdone()">Pay Fees Now</button>`;
    // Only show the receipt section if payment is made, else show fees pending
    let receiptSection = `<div class="receipt-section" style="margin-top:1.5em;">
      <span style="color: red; font-weight: bold;">Fees is pending</span>
    </div>`;
    actionRow.innerHTML = payBtn + receiptSection;
    document.getElementById("payFeesBtn").onclick = paymentdone;
  } else if (status === "paid") {
    stepStatusInfo.textContent = "Payment complete. Awaiting admin approval.";
    // Only show receipt info, not pay btn
    let receiptSection;
    if (student.Reciept && Object.keys(student.Reciept).length > 0) {
      receiptSection = `<button class="action-btn" id="downloadReceiptBtn">Download Offer Letter</button>`;
    } else {
      receiptSection = `<span style="color: #999; font-style: italic;">Offer Letter not available</span>`;
    }
    actionRow.innerHTML = receiptSection;
    if (student.Reciept && Object.keys(student.Reciept).length > 0) {
      document.getElementById("downloadReceiptBtn").onclick = function() {
        downloadReceipt(student._id);
      };
    }
  } else if (status === "approved") {
    stepStatusInfo.textContent = "Seat fully approved. Download your Offer Letter below.";
    let receiptSection;
    if (student.Reciept && Object.keys(student.Reciept).length > 0) {
      receiptSection = `<button class="action-btn" id="downloadReceiptBtn">Download Offer Letter</button>`;
    } else {
      receiptSection = `<span style="color: #999; font-style: italic;">Offer Letter not available</span>`;
    }
    actionRow.innerHTML = receiptSection;
    if (student.Reciept && Object.keys(student.Reciept).length > 0) {
      document.getElementById("downloadReceiptBtn").onclick = function() {
        downloadReceipt(student._id);
      };
    }
  }
}

async function settup(data) {
  const student = data.msg;

  // Update profile name and email
  document.querySelectorAll(".name").forEach(el => el.textContent = student.Name || "N/A");
  document.querySelectorAll(".email").forEach(el => el.textContent = student.Email || "N/A");

  // Update stepper status based on backend data
  let status = "not-allocated";
  if (!student.Branch) {
    status = "not-allocated";
  } else if (student.Branch && !student.FeeStatus) {
    status = "partial";
  } else if (student.FeeStatus && !student.Prefrence1 && !student.Prefrence2) {
    status = "paid";
  } else if (student.FeeStatus && student.Prefrence1) {
    status = "approved";
  }
  document.querySelector(".frost-card").setAttribute("data-status", status);
  updateStepper(status, student);

  // Update profile details
  const profileDetails = document.querySelector(".profile-details");
  if (profileDetails) {
    profileDetails.innerHTML = `
      <div class="detail-row"><span class="detail-label">Name:</span><span>${student.Name || "N/A"}</span></div>
      <div class="detail-row"><span class="detail-label">Email:</span><span>${student.Email || "N/A"}</span></div>
      <div class="detail-row"><span class="detail-label">Address:</span><span>${student.Address || "N/A"}</span></div>
    `;
  }

  // Update marks blocks
  const marksTableHS = document.querySelector(".marks-table:nth-of-type(1)");
  if (marksTableHS) {
    marksTableHS.innerHTML = `
      <div><span>Math</span><span>${student.HSMaths || 'N/A'}</span></div>
      <div><span>Science</span><span>${student.HSScience || 'N/A'}</span></div>
      <div><span>English</span><span>${student.HSEnglish || 'N/A'}</span></div>
      <div><span>Hindi</span><span>${student.HSHindi || 'N/A'}</span></div>
    `;
  }
  const marksTableTT = document.querySelector(".marks-table:nth-of-type(2)");
  if (marksTableTT) {
    marksTableTT.innerHTML = `
      <div><span>Physics</span><span>${student.TTPhysics || 'N/A'}</span></div>
      <div><span>Chemistry</span><span>${student.TTChemistry || 'N/A'}</span></div>
      <div><span>Math</span><span>${student.TTMaths || 'N/A'}</span></div>
    `;
  }
}

// Call this with the student's id to download the reciept (if available)
async function downloadReceipt(studentId) {
  const token = localStorage.getItem("studenttoken");
  try {
    const res = await fetch(`https://mentora-5.onrender.com/admin/paymentreciept/download`, {
      method: "GET",
      headers: { "token": token }
    });
    if (!res.ok) {
      console.log("done");
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payment_receipt.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    window.location.href = "../errorpage/index.html";
  }
}

// On page load, fetch profile info and initialize UI
window.onload = async function() {
  const token = localStorage.getItem("studenttoken");
  try {
    const res = await fetch("https://mentora-5.onrender.com/student/Profile/info", {
      method: "GET",
      headers: { "Content-Type": "application/json", "token": token },
    });
    const json = await res.json();
    if (res.ok) {
      settup(json);
    } else {
      window.location.href = "../errorpage/index.html";
    }
  } catch (e) {
    window.location.href = "../errorpage/index.html";
  }
};

// Payment done handler for payment button
async function paymentdone() {
  const token = localStorage.getItem("studenttoken");
  try {
    const res = await fetch("https://mentora-5.onrender.com/student/Payment/done", {
      method: "POST",
      headers: { "Content-Type": "application/json", "token": token },
    });
    if (res.ok) {
      // Force reload or refetch profile to update UI/status after payment
      window.location.reload();
    } else {
      window.location.href = "../errorpage/index.html";
    }
  } catch (e) {
    window.location.href = "../errorpage/index.html";
  }
}

// Demo admin approval function (should be triggerable only by real admin)
function approval() {
  document.querySelector(".frost-card").setAttribute("data-status", "approved");
  updateStepper("approved");
}
