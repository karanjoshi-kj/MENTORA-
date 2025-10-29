async function submitbtn()
{
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
    try{
    const res = await fetch("http://localhost:3000/student/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({Email : email
                            , Password : password })
        });
        const json = await res.json();
        if(res.ok)
        {
            localStorage.setItem("studenttoken" , json.token);
            window.location.href = "../studentstatus/index.html";
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