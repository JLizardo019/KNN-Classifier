let video;
let features;
let knn, label;
let counter =[0,0,0];
let walk1, walk2, walk3, walk4, walk5, walk6;
let x=50,y=300,direction=1;

// get references
let r = document.getElementById("r_label");
let l = document.getElementById("l_label");
let s = document.getElementById("s_label");

function preload(){
    walk1 = loadImage("assets/walk1.png");
    walk2 = loadImage("assets/walk2.png");
    walk3 = loadImage("assets/walk3.png");
    walk4 = loadImage("assets/walk4.png");
    walk5 = loadImage("assets/walk5.png");
    walk6 = loadImage("assets/walk6.png");
}

function setup() {
  createCanvas(windowWidth, 400);
  imageMode(CENTER);
  video = createCapture(VIDEO);
  video.size(320,240);

  features = ml5.featureExtractor("MobileNeT", modelReady);
  knn = ml5.KNNClassifier();
}

function modelReady()
{
  console.log("model ready!");
}

function draw() {
  background(220);

  if(knn.getNumLabels()==3){
    const vid_logits = features.infer(video);
    knn.classify(vid_logits, gotResult);

    if (direction==1){
        if(label == "left"){
            x+=(5*direction);
            image(walk3,x,y,200,200);
        }
        else if(label == "right"){
            x+=(5*direction);
            image(walk2,x,y,200,200);
        }
        else{
            image(walk1,x,y,200,200);
        }
    }
    else{
        if(label == "left"){
            x+=(5*direction);
            image(walk4,x,y,200,200);
        }
        else if(label == "right"){
            x+=(5*direction);
            image(walk5,x,y,200,200);
        }
        else{
            image(walk6,x,y,200,200);
        }
    }
    
    if (x>=width-50){
        direction*=-1;
    }
    if (x<50){
        direction*=-1;
    }

    push();
    rectMode(CENTER);
    textAlign(CENTER);
    textSize(30);
    text("Walk across the screen by alternating your hands!",width/2,height/2);
    push();
  }
  else {
    image(walk1,x,y,200,200);
    push();
    rectMode(CENTER);
    textAlign(CENTER);
    textSize(30);
    text("Train the model!",width/2,height/2);
    push();
  }
  
}

// move character
function gotResult(err, results){
    if (err){
        console.log(err);
    }
    else{
        // console.log(results.label);
        label = results.label;
    }    
}

// adding new example to model
function addLeft(){
    counter[0] += 1;
    l.innerText = `Raise your right hand. ${counter[0]}`;
    const logits = features.infer(video);
    knn.addExample(logits, "left"); // logits and label
}
function addRight(){
    counter[1] += 1;
    r.innerText = `Raise your left hand. ${counter[1]}`;
    const logits = features.infer(video);
    knn.addExample(logits, "right"); // logits and label
}
function addStill(){
    counter[2] += 1;
    s.innerText = `Keep your hands out of the frame ${counter[2]}`;
    const logits = features.infer(video);
    knn.addExample(logits, "still"); // logits and label
}