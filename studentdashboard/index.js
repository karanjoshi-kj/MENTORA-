async function submitbtn()
{
    const email = document.getElementById("email").value;
    const dob = document.getElementById("dob").value;
    const contact = Number(document.getElementById("contact").value);
    const address = document.getElementById("address").value;
    const mathhs = Number(document.getElementById("math-hs").value);
    const sciencehs = Number(document.getElementById("science-hs").value);
    const englishhs = Number(document.getElementById("english-hs").value);
    const physics = Number(document.getElementById("physics").value);
    const chemistry = Number(document.getElementById("chemistry").value);
    const math12 = Number(document.getElementById("math-12").value);
    const preference1 = document.getElementById("choice1").value;
    const preference2 = document.getElementById("choice2").value;
    const hindihs = Number(document.getElementById("hindi-hs").value);
    try{
        console.log("hi i");
        const res = await fetch("http://localhost:3000/student/apply/seat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({Email : email,
                            Dob : dob , 
                                    Contact : contact , 
                                    Address : address ,
                                    HSMaths : mathhs ,
                                    HSEnglish :englishhs  ,
                                    HSScience :  sciencehs,
                                    HSHindi : hindihs , 
                                    TTMaths : math12 ,
                                    TTChemistry : chemistry ,
                                    TTPhysics : physics , 
                                    Prefrence1 : preference1,
                                    Prefrence2 : preference2
                        })
        });
        if(res.ok)
        {
            window.location.href = "../successsignedup/index.html";
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