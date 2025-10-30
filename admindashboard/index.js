// Logout button handler
document.getElementById('logoutBtn').addEventListener('click', () => {
  window.location.href = '../logout/index.html';
});

// Fetch and render student tables on page load
window.onload = async function() {
  const token = localStorage.getItem("admintoken");
  try {
    const res = await fetch("https://mentora-5.onrender.com/admin/candidates/info", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token": token
      }
    });

    if (!res.ok) {
      window.location.href = "../errorpage/index.html";
    }

    const json = await res.json();
    console.log(json);

    if (!json.msg || !Array.isArray(json.msg)) {
      window.location.href = "../errorpage/index.html";
    }

    // Calculate total TT marks for each student
    json.msg.forEach(student => {
      student.totalTTMarks = 
        (parseInt(student.TTChemistry) || 0) + 
        (parseInt(student.TTMaths) || 0) + 
        (parseInt(student.TTPhysics) || 0);
    });

    // Sort descending by total TT marks
    json.msg.sort((a, b) => b.totalTTMarks - a.totalTTMarks);

    const container = document.getElementById('tablesContainer');
    container.innerHTML = ''; // clear previous tables

    json.msg.forEach(student => {
      const table = createStudentTable(student);
      container.appendChild(table);
    });
  } catch (e) {
    window.location.href = "../errorpage/index.html";
  }
};

// Create a table per student with conditional logic for fee status
function createStudentTable(student) {
  const table = document.createElement('table');
  table.className = 'student-table';

  // Table header (without "Allocate Final Seat" column)
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Contact</th>
      <th>DOB</th>
      <th>Branch</th>
      <th>Preference 1</th>
      <th>Total TT Marks</th>
      <th>Final Seat Allotment</th>
      <th>Offer Letter</th>
    </tr>
  `;
  table.appendChild(thead);

  const dobFormatted = student.Dob ? new Date(student.Dob).toLocaleDateString() : 'N/A';

  const branches = ['CSE', 'ECE', 'MECH', 'EEE', 'CIVIL'];
  function optionsHTML(selected) {
    return branches.map(b => `<option${b === selected ? ' selected' : ''}>${b}</option>`).join('');
  }

  // Conditional rendering based on FeeStatus
  const finalSeatHTML = student.FeeStatus
    ? `<span style="color: green; font-weight: 600;">Payment Complete</span>`
    : `
      <select name="finalSeat">${optionsHTML(student.Branch)}</select>
      <button class="allot-btn">Allot</button>
    `;

  // Receipt button text and behavior based on FeeStatus
const receiptHTML = student.FeeStatus
  ? `<button class="upload-receipt-btn">Upload Offer Letter</button>`
  : `<span style="color: red; font-weight: bold;">Fees is pending</span>`;

  const tbody = document.createElement('tbody');
  tbody.innerHTML = `
    <tr>
      <td>${student.Name || 'N/A'}</td>
      <td>${student.Contact || 'N/A'}</td>
      <td>${dobFormatted}</td>
      <td>${student.Branch || 'Not Assigned'}</td>
      <td>${student.Prefrence1 || 'None'}</td>
      <td>${student.totalTTMarks}</td>
      <td>${finalSeatHTML}</td>
      <td>${receiptHTML}</td>
    </tr>
  `;
  table.appendChild(tbody);

  // Attach event listener for "Allot" only if fee not paid
  if (!student.FeeStatus) {
    tbody.querySelector('.allot-btn').addEventListener('click', () => {
      const select = tbody.querySelector('select[name="finalSeat"]');
      const chosen = select.value;
      if (chosen === 'Select Branch' || !chosen) {
        alert("Please select a seat to allot");
        return;
      }
      alert(`Final seat "${chosen}" allotted to ${student.Name}`);
      Seatallocate(chosen, student._id);
    });
  }

  // Receipt button handling
  // Upload Receipt button (when fee paid)
  const uploadBtn = tbody.querySelector('.upload-receipt-btn');
  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
      localStorage.setItem("StudentID" , student._id);
      // Redirect to upload receipt page (change URL as needed)
      window.location.href = `../payment/index.html`;
    });
  }

  // Download Receipt button (when fee pending)
  const downloadBtn = tbody.querySelector('.download-receipt-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      alert(`Download Offer Letter for ${student.Name}`);
      // Implement your download logic here
    });
  }

  return table;
}


async function Seatallocate(branch, studentId) {
  console.log('Branch:', branch, 'StudentID:', studentId);
  const token = localStorage.getItem("admintoken");
  try {
    const res = await fetch("https://mentora-5.onrender.com/admin/branch/assign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": token  
      }, 
      body: JSON.stringify({
        branch: branch,
        StudentID: studentId
      })
    });

    if (!res.ok) {
      window.location.href = "../errorpage/index.html";
    }

    const json = await res.json();
    console.log("Branch assigned:", json);
  } catch (error) {
    window.location.href = "../errorpage/index.html";
  }
}
