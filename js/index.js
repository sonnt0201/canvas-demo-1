window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const image1 = document.getElementById("image1");

  class Particle {
    constructor(effect) {
      this.effect = effect;
      this.x = Math.random() * this.effect.width;
      this.y = Math.random() * this.effect.height;
      this.size = 10;
      this.vx = Math.random() * 2 - 1;
      this.vy = Math.random() * 2 - 1 ;
    }

    draw(context) {
      context.fillRect(this.x, this.y, this.size, this.size);
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
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
      console.log(this.image);
    }

    init() {
      for (let i = 0; i < 100; i++) {
        this.particlesArray.push(new Particle(this));
      }
    }

    draw(context) {
      this.particlesArray.forEach((particle) => particle.draw(context));
      context.drawImage(this.image, this.x, this.y);
    }

    update() {
      this.particlesArray.forEach((particle) => particle.update());
    }
  }
    const effect = new Effect(canvas.width, canvas.height);
    effect.init();
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.draw(ctx);
    effect.update();
    requestAnimationFrame(animate);
  }

  
 
  animate()
 
});
