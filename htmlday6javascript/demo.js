function myfun()
{
    var us=document.getElementById('txtusername').Value;
    var m=document.getElementById('txtmobile').Value;
    var e=document.getElementById('txtmail').Value;
    var r=document.getElementById('txtroll').Value;
    if(/^[a-zA-Z]{6,10}$/.test(us))
    {
        if(/^[6-9][0-9]{9}$/.test(m))
        {
            if(/^[a-zA-Z0-9._-]{6,12}[@][a-z]{3,15}[.][a-z]{2,6}$/.test(e))
            {
                if(/^[2][2][1][7][1][0][3][0][3][0][0-9][0-9]$/.test(r))
                {
                    window.alert('valid details');
                }
                else window.alert("invalid");
            }
        }
        
    }

}