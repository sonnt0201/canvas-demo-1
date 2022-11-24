window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const image1 = document.getElementById("image1");

  class Particle {
    constructor(effect, x, y, color) {
      this.effect = effect;
      this.x = Math.random() * this.effect.width;
      this.y = Math.random() * this.effect.height;
      this.originX = Math.floor(x);
      this.originY = Math.floor(y);
      this.color = color;
      this.size = this.effect.gap;
      this.vx = 0;
      this.vy = 0;
      this.ease = 0.4;

      this.dx = 0;
      this.dy = 0;
      this.distance = 0;
      this.force = 0;
      this.angle = 0;
      this.friction = 0.95; // ma sát

      
    }

    draw(context) {
      context.fillRect(this.x, this.y, this.size, this.size);
      context.fillStyle = this.color
    }

    update() {
      // (dx, dy) - vector nối từ particle tới chuột
      this.dx = this.effect.mouse.x - this.x;
      this.dy = this.effect.mouse.y - this.y;
      this.distance = this.dx * this.dx + this.dy * this.dy; 

      // càng gần thì lực càng lớn, càng xa thì lực đẩy càng nhỏ 
      // dấu trừ => gia tốc ngược chiều vận tốc, càng đẩy ra xa thì particle đi càng chậm và dừng lại về 0 
      this.force = -this.effect.mouse.radius/this.distance;

      if (this.distance < this.effect.mouse.radius) {
        this.angle = Math.atan2(this.dy, this.dx);
        // coi khối lượng là 1 => vận tốc = vận tốc ban đầu + gia tốc * t với gia tốc bằng lực
        
        // lấy cos để được hình chiếu của lực/ gia tốc xuống trục ox
        this.vx += this.force * Math.cos(this.angle) ;
        // tương tự với y
        this.vy += this.force * Math.sin(this.angle); 
      }


      // this.originX - this.x là vector dời từ điểm hiện tại đến điểm originX
      this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease; 
      this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
      /* 
        vector dời (Dx, Dy) là hợp của 2 thành phần: (vx, vy) khi mousemoving và  
        vector (dx, dy) để phục hồi particle về vị trí đúng (originX, originY)

        khi (vx, vy) về 0 thì chỉ còn vector hồi, điểm ảnh về vị trí cũ
      */

        /*
          friction để vận tốc (vx,vy) giảm dần khi particle di chuyển => sau cùng (vx,vy) = 0;
        */

    }

    warp() {
      this.x = Math.random() * window.innerWidth;
      this.y = Math.random() * window.innerHeight;
      this.ease = 0.4;
    }
  }

  class Effect {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.particlesArray = [];
      this.image = document.getElementById("image1");
      this.centerX = this.width / 2.0;
      this.centerY = this.height / 2.0;
      this.x = this.centerX - this.image.width / 2.0;
      this.y = this.centerY - this.image.height / 2.0;
      this.gap = 2;

      this.mouse = {
        radius: 2000,
        x: undefined,
        y: undefined
      }
      window.addEventListener('mousemove', event => {
        this.mouse.x = event.clientX;
        this.mouse.y = event.clientY;
      });
    }

    init(context) {
      context.drawImage(this.image, this.x, this.y);
      const pixels = context.getImageData(0, 0, this.width, this.height).data;
      for (let y = 0; y < this.height; y+= this.gap){
        for (let x = 0; x < this.width; x+= this.gap) {
          const index = (y * this.width + x) * 4; // lấy index theo thứ tự pixel gốc
          
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels [index + 2];
          const alpha = pixels[index + 3];
          const color = `rgb(${red}, ${green}, ${blue})`;
          if (alpha > 0) {
            this.particlesArray.push(new Particle(this, x, y, color));
            // console.log(new Particle(this, x, y, color));
          }
          
        }
      }
      
    }

    draw(context) {
      //    context.drawImage(this.image, this.x, this.y);
      this.particlesArray.forEach((particle) => particle.draw(context));
    }

    update() {
      this.particlesArray.forEach((particle) => particle.update());
    }

    warp() {
      this.particlesArray.forEach( (particle)  => particle.warp());
    }
  }

  const effect = new Effect(canvas.width, canvas.height);
  effect.init(ctx);
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.draw(ctx);
    effect.update();
    requestAnimationFrame(animate);
  }
  animate();
  
  // warp button
  const warpButton = document.getElementById('warpButton');
  warpButton.addEventListener('click', function() {
    effect.warp();
  })
});
