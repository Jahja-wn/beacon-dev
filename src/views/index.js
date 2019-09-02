window.onload = function (e) {
    liff.init(function (data) {
        init(data);
    });
};

function init(data) {
    liff.getProfile().then(function (profile) {
        document.getElementById('userId').value = profile.userId;
        document.getElementById('displayName').value = profile.displayName;
    }).catch(function (error) {
        window.alert("Error getting profile: " + error);
    });
}
function myFunction() {
    var firstname = document.getElementById('firstName').value;
    var lastname = document.getElementById('lastName').value;
    var nickname = document.getElementById('nickName').value;
    if (firstname == "" || lastname == "" || nickname == "") {
        alert("Name must be filled out");
        return false;
    } else {
        alert("\n" + "save successfully");
    }
    document.getElementById('sh_first').textContent = firstname;
    document.getElementById('sh_last').textContent = lastname;
    document.getElementById('sh_nick').textContent = nickname;

}   