let r=[];
let dirs=[];
let counter=0;
let t1;
let d;
let narr=[];
let allcrashed;
let slider;
function setup(){
createCanvas(500,500);
background(120);

for (let i=0; i<30; i++){
    r[i] = new rocket();
    }
    t1=new target(width/2,height/4);
    allcrashed=0;
    slider = createSlider(1, 255, 1);;
    slider.position(0,600);
}

function draw(){
    let val=slider.value();
    background(120);
    for (let t=0; t<val; t++){
        for (let i=0; i<30; i++){
            r[i].show();
            r[i].check();
            r[i].update();
            let d1=dist(r[i].pos.x,r[i].pos.y,t1.pos.x,t1.pos.y);
            r[i].fitness=map(d1,0,width,100,0);
            if ((r[i].crashed==true || r[i].success==true) && r[i].checked==false){
                allcrashed++;
                r[i].checked=true;
            }
        }
    t1.show();
    if (allcrashed>29){
        reproduce();
        allcrashed=0;
        counter=0;
    }
    counter++;
    }
}
function reproduce(){
    let narr=[]
    let midpoint=random(10,190);
    for (let i=0; i<30; i++){
        let n=r[i].fitness;
       for (let j=0; j<n; j++){
           narr.push(r[i]);
       }
    }

    for (let i=0; i<30; i++ ){
    let ParentA=random(narr);
    let ParentB=random(narr);
    let childdna=[];
    for (let j=0; j<200; j++){
        if (j>midpoint){
        childdna[j]=ParentA.dna.dirs[j];

    }
    else{
        childdna[j]=ParentB.dna.dirs[j];
    }
    
}
//mutate
if (random(1)<0.01){
    for(let k=0; k<200; k++){
    childdna[k]=p5.Vector.random2D();
}
}
r[i]=new rocket(childdna);
}
    



}

class DNA{
    constructor(veks){
        
        this.dirs=[];
        if (veks){
            this.dirs=veks;
        }else{
    for (let i=0; i<200; i++){
        this.dirs[i]=p5.Vector.random2D();
        }
    }
}
}

class rocket{
    constructor(veks){
      this.pos=createVector(width/2,height-1);
      this.acc=createVector();
      this.vel=createVector();
      if (!veks){
      this.dna=new DNA();
    }else {
        this.dna=new DNA(veks);
    }
      this.fitness=0;
      this.crashed=false;
      this.success=false;
      this.checked=false;
      this.frames=0;
    }
    show(){
        this.frames++;
        push();
        translate(this.pos.x,this.pos.y);
        rotate(this.vel.heading()+PI/2);
        fill(0,120,0,200);
        triangle(0,0,0-5,0+15,0+5,0+15);
        pop();
    }
    
    check(){
        if (this.pos.x>width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0){
            this.crashed=true;
        }
        d = dist(this.pos.x,this.pos.y,t1.pos.x,t1.pos.y);
        if (d<10){
            this.success=true;
            this.fitness-=(this.frames/10);
        }
    }
    


    update(){
    if (this.crashed==false && this.success==false){
        this.acc.add(this.dna.dirs[counter]);
        this.vel.add(this.acc);
        this.vel.limit(4);
        this.pos.add(this.vel);
    }else if (this.crashed==true){
        this.fitness = 1;
    }else if(this.success==true){
        this.fitness=100;
    }
    }

}

class target{
    constructor(x,y){
        this.pos=createVector(x,y);

    }

    show(){
        fill(120,0,0,120);
        ellipse(this.pos.x,this.pos.y,20,20);
    }

}