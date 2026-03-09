document.getElementById("login-btn").addEventListener("click",function(){
    //get the username
    const nameInput =document.getElementById("input-name");
    const username = nameInput.value;
    console.log(username);

    //get the password
    const passInput =document.getElementById("input-pass");
    const password =passInput.value;
    console.log(password);


    //match the credentials
    if(username=="admin" && password=="admin123"){
        //3-1true>>goto homepage
        alert("login success")
        window.location.assign("/home.html");
    }
    //3-2true>>alert> return
    else{
            alert("login failed")
            return;
        }

})