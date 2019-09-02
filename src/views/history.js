window.onload = function (e) {
    liff.init(function (data) {
        init(data);
        getProfile();
    });
};

function init(data) {
     var userId = data.context.userId;
}
function getProfile(){
    liff.getProfile().then(function (profile) {
        document.getElementById('displayName').textContent = profile.displayName;
        const profilePictureDiv = document.getElementById('profilepicturediv');
        if (profilePictureDiv.firstElementChild) {
            profilePictureDiv.removeChild(profilePictureDiv.firstElementChild);
        }
        const img = document.createElement('img');
        img.src = profile.pictureUrl;
        img.alt = "Profile Picture";
        profilePictureDiv.appendChild(img);

    }).catch(function (error) {
        window.alert("Error getting profile: " + error);
    });

}