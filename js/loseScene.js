export class loseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'loseScene' });
  }

  create() {
    // Achtergrondkleur instellen
    this.cameras.main.setBackgroundColor('#1a1a1a');

    // Verliesbericht centreren
    this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, 'Game Over!', {
      fontSize: '64px',
      fill: '#ff0000',
      fontFamily: 'Arial',
      stroke: '#000',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Start opnieuw knop
    const button = this.add.text(this.scale.width / 2, this.scale.height / 2 + 20, 'Opnieuw starten', {
      fontSize: '32px',
      fill: '#ffffff',
      backgroundColor: '#ff0000',
      padding: {
        x: 20,
        y: 10
      },
      fontFamily: 'Arial',
      borderRadius: 10
    }).setOrigin(0.5).setInteractive();

    // Hover effect
    button.on('pointerover', () => {
      button.setStyle({ fill: '#000000', backgroundColor: '#ffaaaa' });
    });

    button.on('pointerout', () => {
      button.setStyle({ fill: '#ffffff', backgroundColor: '#ff0000' });
    });

    // Klik om naar StartScene te gaan
    button.on('pointerdown', () => {
      this.scene.start('StartScene'); // Zorg dat je StartScene correct hebt geregistreerd
    });
  }
}
