export class fireIntro extends Phaser.Scene {
  constructor() {
    super({ key: 'fireIntro' }); // Scene key
  }

  preload() {
    this.load.image('fireBg', 'assets/fireIntro.png'); // Laad achtergrondafbeelding
    this.load.audio('IntroMusic', 'assets/intro.mp3'); // Laad achtergrondmuziek
  }

  init(data) {
    this.selectedCharacter = data.character; // Gekozen karakter uit vorige scene
    this.playerName = data.playerName;       // Gekozen naam uit vorige scene
    this.lives = data.lives || 3;            // Aantal levens, standaard 3
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Achtergrondafbeelding op het scherm zetten
    const bg = this.add.image(centerX, centerY, 'fireBg').setOrigin(0.5);
    bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // Naam van de speler tonen
    const nameText = this.add.text(100, 100, `Naam: ${this.playerName}`, {
      fontSize: '32px',
      fill: '#fff'
    });

    // Hartjes boven de naam, met tekst
    const heartsY = nameText.y - 50; // 50 pixels boven de naam
    const heartsXStart = nameText.x + nameText.width / 2 - ((this.lives - 1) * 35) / 2; // gecentreerd

    // Tekst boven de hartjes
    this.add.text(
      heartsXStart + ((this.lives - 1) * 35) / 2, // midden van de hartjes
      heartsY - 30,
      `You have ${this.lives} left`,
      {
        fontSize: '24px',
        fill: '#fff'
      }
    ).setOrigin(0.5);

    // Hartjes tekenen
    for (let i = 0; i < this.lives; i++) {
      this.add.image(heartsXStart + i * 35, heartsY, 'heart')
        .setScrollFactor(0)
        .setScale(0.05);
    }

    // Titel van het level
    this.add.text(centerX, centerY - 140, 'Level 3: The Fire', {
      fontSize: '112px',
      fill: '#ffffff',
      fontFamily: 'Griffy',
    }).setOrigin(0.5);

    // Uitlegtekst
    this.add.text(centerX, centerY - 30, 'Vermijd de vlammen en vind de uitgang!', {
      fontSize: '67px',
      fill: '#cde13a',
      fontFamily: 'Irish Grover',
    }).setOrigin(0.5);

    // Knop om naar het volgende level te gaan
    const button = this.add.text(centerX, centerY + 300, 'Ga naar volgende level', {
      fontSize: '70px',
      color: '#ffffff',
      fontFamily: 'Irish Grover'
    }).setOrigin(0.5).setInteractive();

    // Hover-effect voor knop
    button.on('pointerover', () => {
      button.setStyle({ color: '#e0ff00' });
    });

    button.on('pointerout', () => {
      button.setStyle({ color: '#ffffff' });
    });

    // Klik op knop: stop muziek en ga naar volgende scene
    button.on('pointerdown', () => {
      if (this.bgMusic) this.bgMusic.stop();
      this.scene.start('theFire', {
        character: this.selectedCharacter,
        playerName: this.playerName,
        lives: this.lives
      });
    });

    // Speel achtergrondmuziek
    this.bgMusic = this.sound.add('IntroMusic', { loop: true, volume: 0.5 });
    this.bgMusic.play();
  }
}
