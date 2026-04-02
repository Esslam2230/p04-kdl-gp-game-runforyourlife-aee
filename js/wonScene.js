export class wonScene extends Phaser.Scene {
  constructor() {
    super({ key: 'wonScene' }); // Scene key
  }

  preload() {
    // Hier kun je eventueel win-muziek of afbeeldingen laden
  }

  create() {

    // Achtergrondkleur instellen
    this.cameras.main.setBackgroundColor('#003300'); // Donkergroen als overwinningskleur

    // Winsttekst centreren
    this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, 'You Have Won!', {
      fontSize: '64px',
      fill: '#00ff00',
      fontFamily: 'Arial',
      stroke: '#000',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Start opnieuw knop
    const button = this.add.text(this.scale.width / 2, this.scale.height / 2 + 20, 'Terug naar begin', {
      fontSize: '32px',
      fill: '#ffffff',
      backgroundColor: '#00aa00',
      padding: {
        x: 20,
        y: 10
      },
      fontFamily: 'Arial'
    }).setOrigin(0.5).setInteractive();

    // Hover effect voor de knop
    button.on('pointerover', () => {
      button.setStyle({ fill: '#000000', backgroundColor: '#66ff66' });
    });

    button.on('pointerout', () => {
      button.setStyle({ fill: '#ffffff', backgroundColor: '#00aa00' });
    });

    // Klik op knop: ga terug naar StartScene
    button.on('pointerdown', () => {
      this.scene.start('StartScene'); // Zorg dat StartScene beschikbaar is
    });
  }
}
