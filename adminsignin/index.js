async function submitbtn()
{
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
    try{
    const res = await fetch("http://localhost:3000/admin/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({Email : email
                            , Password : password })
        });
const json = await res.json();
        if(res.ok)
        {
          localStorage.setItem("admintoken" , json.token);
            window.location.href = "../admindashboard/index.html";
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