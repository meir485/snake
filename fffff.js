const {Engine , Render , Runner , World , Bodies , Body , Events} = Matter;
//bugs - sharp turns
//     - apple appers on snake
// APPLE PHYSICALY CHANGES ANAKE
//COLOR
const height = 800;
const width = 800;
const unit = 50;
let headDir = 'horizantal';
let i = '';
let dir='';
//basic setup
const engine = Engine.create();
engine.world.gravity.y = 0; //no gravity
const {world} = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      wireframes: false,
      width,
      height
    }
  });
Render.run(render);
Runner.run(Runner.create(), engine);
//walls
const walls = [
    Bodies.rectangle(width / 2, 0, width, 10, { isStatic: true , label:'wall' }),
    Bodies.rectangle(width / 2, height, width, 10, { isStatic: true , label:'wall' }),
    Bodies.rectangle(0, height / 2, 10, height, { isStatic: true , label:'wall' }),
    Bodies.rectangle(width , height / 2, 10, height, { isStatic: true , label:'wall'}),
]
World.add(world , walls);
//head
const head = Bodies.circle(unit, unit, unit / 4 ,{
    render : {fillStyle:'red'}, 
    label:'head'
});
World.add(world, head);
//apple
const apple = Bodies.circle(width /2, height / 2, unit / 4 ,{
    render : {fillStyle:'green'}, 
    label:'apple',
    isStatic: true
});
World.add(world, apple);
//snake array
let arr = [head]
//click events
document.addEventListener('keydown' , event => {
    
      if (event.keyCode === 37) {
       move('left');
      }

      if (event.keyCode === 38) {
        move('up');
      }
    
      if (event.keyCode === 39) {
        move('right');
      }
    
      if (event.keyCode === 40) {
        move('down');
      }
})

//touch events
Events.on(engine, 'collisionStart' ,event =>{
    event.pairs.forEach(cl => {
        const fails = ['wall' ,'head' ,'part'] //add 'part'
        const wins = ['apple' , 'head','part']
        if(fails.includes(cl.bodyA.label)&&fails.includes(cl.bodyB.label)){lose();}
        if(wins.includes(cl.bodyA.label)&&wins.includes(cl.bodyB.label)){ate(dir);}
    });
})

const move = c => {
    dir = c;
//switch to chek that if moving in horizantal/vertical direction arrows that are in the same direction world be blocked here
   switch (headDir){
       case 'vertical':
           if(c==='up'||c==='down'){return;}
           else{headDir='horizantal'};
           break;
       case 'horizantal':
           if(c==='left'||c==='right'){return;}
           else{headDir='vertical'};
           break;
   }
   clearInterval(i)
   i=setInterval(() => moving(c),100)
   
}
const moving = c => {
    console.log(c);
    
    switch (c){
        case 'right':
            Body.setPosition(arr[arr.length-1], { x:arr[0].position.x+(unit*0.75)   , y:arr[0].position.y});
            break;
        case 'left':
            Body.setPosition(arr[arr.length-1], { x:arr[0].position.x-(unit*0.75) , y:arr[0].position.y});
            break;
        case 'up':
            Body.setPosition(arr[arr.length-1], { x:arr[0].position.x , y:arr[0].position.y-(unit*0.75) });
            break;
        case 'down':
            Body.setPosition(arr[arr.length-1], { x:arr[0].position.x , y:arr[0].position.y+(unit*0.75) });
            break;
    }
    if(arr.length>1){
       
    let t =arr.pop()
   
    arr.unshift(t)
    }
   
}

const lose = () =>{
    alert('fail')
}

const ate = (c) => {
    //move apple
    Body.setPosition(apple ,{
        x:(Math.floor(Math.random() * (width-unit)) + unit),
        y:(Math.floor(Math.random() * (height-unit)) + unit)
    })
    //add part to snake
    //get last part direction
   let {x:lPx,y:lPy}=arr[arr.length-1].position;

    // added to behind
    if(arr.length>1){
        
    let {x:bPx,y:bPy}=arr[arr.length-2].position;
    let sx = lPx - bPx;
    let sy = lPy - bPy;
    let NPx;
    let NPy;
    switch (sx , sy){
        case sx===0 && sy>0: //up
            NPx=lPx
            NPy=lPy+(0.75*unit)
            break;
        case sx===0 && sy<0: //down
            NPx=lPx
            NPy=lPy-(0.75*unit)
            break;
        case sy===0 && sx<0://right
            NPx=lPx-(0.75*unit)
            NPy=lPy
            break;
        case sy===0 && sx<0://left
            NPx=lPx+(0.75*unit)
            NPy=lPy 
            break;
    }

    }
    else{
        NPy=lPy+(0.75*unit);
        NPx=lPy+(0.75*unit)
    }
    
    //make new part
    let part = Bodies.circle(NPx, NPy, unit / 4 ,{
        render : {fillStyle:'purple'}, 
        label:'part',
    });
    World.add(world, part);
   
    arr.push(part)
   
}