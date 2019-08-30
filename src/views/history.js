import { userModel } from '../core/model';
const mongoose = require('mongoose');
const userColl = mongoose.model('users', userModel);
window.onload = function (e) {
    liff.init(function (data) {
        init(data);
    });
};

function init(data) {
    var userId = data.context.userId;
    userColl.find({ userId: userId })
        .then((docs) => {
            // var loops = document.getElementById('loops');
            for(var i = 0 ; i<docs.length; i++)
            document.getElementById('namefield').textContent = docs[i].displayName;
            document.getElementById('typefield').textContent = docs[i].type;
            document.getElementById('timestampfield').textContent = docs[i].timestamp;
            document.getElementById('locationfield').textContent = docs[i].location.locationName;
            document.getElementById('planfield').textContent = docs[i].plan;
        })
        .catch((error) => {
            window.alert("Error getting data: " + error);
        })
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