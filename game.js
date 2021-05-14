let config = {
    type:Phaser.AUTO,
    
    scale:{
        mode:Phaser.Scale.FIT,
        width : window.innerWidth,
        height :window.innerHeight,
    },
    
    backgroundColor : 0xffff11,
    
    physics:{
        default:'arcade',
        arcade :{
            gravity:{
                y:1000, 
            },
            debug:false,
        }
    },
    
    scene : {
     preload:preload,
     create : create,
     update : update,
    }
};


let game = new Phaser.Game(config);

let player_config = {
    player_speed : 180,
    player_jumpspeed : -800,
}


function preload(){
    this.load.image("ground","assets/topground.png");
    this.load.image("sky","assets/background.png");
    this.load.image("apple","assets/apple.png");
    this.load.spritesheet("dude","assets/mario.png",{frameWidth:64,frameHeight:64});
    this.load.image("coin1","assets/Coin1.png");
    this.load.image("coin2","assets/Coin2.png");
    this.load.image("coin3","assets/Coin3.png");
    this.load.image("coin4","assets/Coin4.png");
    this.load.image("coin5","assets/Coin5.png");
    this.load.image("coin6","assets/Coin6.png");
    this.load.image("ray","assets/ray.png");
    this.load.image("tree","assets/tree.png");
    this.load.image("princess","assets/peach.png");
    this.load.audio('collect',"audio/coin-jingle.mp3");
    this.load.image('bird1',"assets/bird1.png");
    this.load.image('bird2',"assets/bird2.png");
    this.load.image('grass','assets/grass.png');
    this.load.image('enemy','assets/enemy.png');
}

let items = 31;
var score = 0;
var scoreText;
var music;
var timeText;
function create(){
    W = game.config.width;
    H = game.config.height;

    let ground = this.add.tileSprite(0,H-128,W,128,'ground');
    let enemy = this.add.sprite(1325,380,'enemy');
    enemy.setScale(0.07,0.07);
    let tree1 = this.add.sprite(1480,400,'tree');
    tree1.setScale(0.1,0.1);
    let bird1=this.add.sprite(30,70,'bird2');
    bird1.setScale(0.1,0.1);
    this.tweens.add({
        targets: bird1,
        x: 2000,
        duration: 12000,
        ease: function (t) {
            return Math.pow(Math.sin(t * 3), 3);
        },
        delay: 1000,
        repeat:-1
    });
    let bird2=this.add.sprite(100,90,'bird1');
    bird2.setScale(0.1,0.1);
    this.tweens.add({
        targets: bird2,
        x: -2000,
        duration: 12000,
        ease: function (t) {
            return Math.pow(Math.sin(t * 3), 3);
        },
        delay: 1000,
        repeat:-1
    });
    ground.setOrigin(0,0);
    let background = this.add.sprite(0,0,'sky');
    background.setOrigin(0,0);
    background.displayWidth = W;
    background.displayHeight = H;
    background.depth = -2;
    let rays = [];
    var k=0;
    for(let i=-5;i<=5;i++){
        let ray = this.add.sprite(W/2,H-100,'ray');
        ray.displayHeight = 1.4*H;
        ray.setOrigin(0.5,1);
        ray.alpha = 0.2;
        ray.angle = i*20;
        ray.depth = -1;
        ray.tint = Math.random() * 0xffffff;
        rays.push(ray);
    }
    console.log(rays);
    this.tweens.add({
        targets: rays,
        props:{
            angle:{
                value : "+=5"
            },
        },
        duration : 8000,
        repeat : -1
    });
    
scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: 'yellow' });
itemText  = this.add.text(300, 16, 'items: 16', { fontSize: '32px', fill: 'yellow' });
var timeTextStyle = {font: "24px Roboto", fill: '#E43AA4', stroke: '#000', strokeThickness: 4}; 
  timeText = this.add.text(700,16, "Time Left: 2:00", timeTextStyle); 

    this.player = this.physics.add.sprite(100,100,'dude',0);
    console.log(this.player);
    this.player.setBounce(0.5);
    this.player.setCollideWorldBounds(true);
    
    this.anims.create({
        key : 'left',
        frames: this.anims.generateFrameNumbers('dude',{start:4,end:7}),
        frameRate : 10,
        repeat : -1
    });
    this.anims.create({
        key : 'center',
        frames: [{key:'dude',frame:0}],
        frameRate : 10,
    });
    this.anims.create({
        key : 'right',
        frames: this.anims.generateFrameNumbers('dude',{start:8,end:11}),
        frameRate : 10,
        repeat : -1
    });
 
    this.cursors = this.input.keyboard.createCursorKeys();
    let fruits = this.physics.add.group({
        key: "apple",
        repeat : 15,
        setScale : {x:0.1,y:0.1},
        setXY : {x:10,y:0,stepX:100},
    });
    let coins = this.physics.add.group({
        key: "coin1",
        repeat: 15,
        setScale : {x:0.3,y:0.6},
        setXY : {x:50,y:0,stepX:100},

    });
    
    let goal = this.physics.add.group({
        key: "princess",
        repeat : 0,
        setScale : {x:0.08,y:0.08},
        setXY : {x:1480,y:0,stepX:100},
    });
 
    this.anims.create({
        key: 'rotate',
        frames: [
            { key: 'coin1' },
            { key: 'coin2' },
            { key: 'coin3' },
            { key: 'coin4' },
            { key: 'coin5' },
            { key: 'coin6'},
        ],
      frameRate: 10,
      repeat: -1
        
    });
    fruits.children.iterate(function(f){
        f.setBounce(Phaser.Math.FloatBetween(0.4,0.7));
    });
    coins.children.iterate(function(f){
        f.setBounce(Phaser.Math.FloatBetween(0.4,0.7));
        
        f.play('rotate');
        
    });
    let tree2 = this.add.sprite(1220,200,'tree');
    tree2.setScale(0.1,0.1);
    let platforms = this.physics.add.staticGroup();
    platforms.create(500,350,'ground').setScale(2,0.5).refreshBody();
    platforms.create(700,200,'ground').setScale(2,0.5).refreshBody();
    platforms.create(100,200,'ground').setScale(2,0.5).refreshBody();
    platforms.create(1000,400,'ground').setScale(2,0.5).refreshBody();
    platforms.create(1000,100,'ground').setScale(2,0.5).refreshBody();
    platforms.create(1200,250,'ground').setScale(2,0.5).refreshBody();
    platforms.create(1500,400,'ground').setScale(2,0.5).refreshBody();
    platforms.create(1300,430,'grass').setScale(0.8,0.4).refreshBody();
    platforms.add(ground);
    
    this.physics.add.existing(ground,true);
    this.physics.add.collider(platforms,this.player);
    this.physics.add.collider(ground,coins);
    this.physics.add.collider(platforms,coins);
    this.physics.add.overlap(this.player,coins,getCoin,null,this);
    this.physics.add.collider(platforms,fruits);
    this.physics.add.overlap(this.player,fruits,eatFruit,null,this);
    this.physics.add.collider(ground,goal);
    this.physics.add.overlap(this.player,goal,winGame,null,this);
    this.cameras.main.setBounds(0,0,W,H);
    this.physics.world.setBounds(0,0,W,H);
    this.cameras.main.startFollow(this.player,true,true);
    this.cameras.main.setZoom(1.5);
    
}

function update(){
    
   
    if(this.cursors.left.isDown){
        this.player.setVelocityX(-player_config.player_speed);
        this.player.anims.play('left',true);
        
    }
    else if(this.cursors.right.isDown){
        this.player.setVelocityX(player_config.player_speed);
        this.player.anims.play('right',true);
         
    }
    else{
        this.player.setVelocityX(0);
        this.player.anims.play('center');
        
    }
    if(this.cursors.up.isDown && this.player.body.touching.down){
        this.player.setVelocityY(player_config.player_jumpspeed);
        
    }
    
}
function winGame(player,goal){
    
    if(items>0)
    {
        window.alert("Collect all items first!!");
        player.body.x=100;
    }
    else{
        window.alert("You have collected all items and reached the princess!! Congratulations you win!!");   
    }
   }
function getCoin(player,coin){
    coin.disableBody(true,true);
    score+=10;
    items-=1;
    scoreText.setText('Score: ' + score);
    itemText.setText('items: ' + items);
}
function eatFruit(player,fruit){
    fruit.disableBody(true,true);
    score+=20;
    items-=1;
    scoreText.setText('Score: ' + score);
    itemText.setText('items: ' + items);
    
}

window.setTimeout(function(){ 
var r = confirm("GAME OVER, TIME OF 2 MINUTES IS UP, CLICK OK TO PLAY AGAIN!!!!");
if (r == true){
  window.location.reload();
}

}, 120000);
