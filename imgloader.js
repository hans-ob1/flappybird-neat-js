// load and handles all assets

var ImgLoader ={
    imgList: [],

    loadImage: function(imgset){
        var len = imgset.length;
        var i;
        
        //load images
        for (i = 0; i < len; i++){
            this.imgList[imgset[i]] = new Image();
            this.imgList[imgset[i]].src = "assets/img2/" + imgset[i] + ".png";
        }

        console.log("done loading images")
    },

    getImage: function(imgName){
        return imgList[imgName];
    }
}