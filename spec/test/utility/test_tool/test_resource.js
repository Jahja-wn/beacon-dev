
(function () {'use strict';}());
import rimraf from 'rimraf';
import fs from 'fs';


function clearDir(testpath){
    if (fs.existsSync(testpath)) rimraf.sync(testpath);
}

export{
    clearDir
};
