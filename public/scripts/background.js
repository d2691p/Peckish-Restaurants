var counter = 0;
function changeBG(){

    var imgs = [
        "url(/img/img2.png)",
        "url(/img/img4.png)",
        "url(/img/img5.png)",
        "url(/img/img6.png)",
        "url(/img/img7.png)",
        "url(/img/img8.png)",
        "url(/img/img9.png)",
        "url(/img/img1.png)",
      ]
      
    if(counter === imgs.length) counter = 0;
    $("body").css("background-image", imgs[counter]);

    counter++;
}