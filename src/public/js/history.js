$(document).ready(async (e) => {
    liff.init(function (data) {
        var userIdfield = "U5924eb56f756b1cbc1a565a5467be412"
        $('#data').load('/liff/gethistory', { userId: userIdfield })
        getProfile();
    });
});


function getProfile() {

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