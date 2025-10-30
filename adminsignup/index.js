function setcolor()
{
    const inppass = document.getElementById("password");
    const inpcpass = document.getElementById("cpassword");

    setInterval(function()
    {
        inppass.style.borderColor = "red";
        inpcpass.style.borderColor = "red";
    } , 5000);

    inppass.style.borderColor = "";
    inpcpass.style.borderColor = "";
}
async function submitbtn()
{
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const cpassword = document.getElementById("cpassword").value;
  if(password == cpassword)
  {
    try{
    const res = await fetch("https://mentora-5.onrender.com/admin/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Name : name
                            , Email : email
                            , Password : password })
        });

        if(res.ok)
        {
            window.location.href = "../adminsignin/index.html";
        }
        else
        {
            window.location.href = "../errorpage/index.html";
        }
    } 
    catch(e)
    {
       window.location.href = "../errorpage/index.html";
    }
  }
  else
  {
    setcolor();
  }
} 