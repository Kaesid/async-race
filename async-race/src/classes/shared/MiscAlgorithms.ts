import { IValues } from '../../intefaces';

function getRandomElementOfArray(array: string[]): string {
  return array[Math.trunc(Math.random() * array.length)];
}

export class MiscAlgorithms {
  private location = '';

  private correctFormat = '';

  private carName = '';

  private defaultColor = '#000000';

  private rangeRGB = 256;

  private carBrands: string[];

  private carModels: string[];

  constructor() {
    this.carBrands = [
      'Chevorlet',
      'Ford',
      'Toyota',
      'Honda',
      'Porshe',
      'Jeep',
      'BMW',
      'Audi',
      'Subaru',
      'Dodge',
      'Nissan',
    ];

    this.carModels = [
      'Corvette',
      'Mustang',
      'Camry',
      'Civic',
      'Accord',
      'Kamri',
      'Wrangler',
      'CR-V',
      '4Runner',
      'Outback',
      'Altima',
    ];
  }

  checkAdress(pageName: string, userInput: string): boolean {
    this.location = `#/${pageName}/`;

    this.correctFormat = userInput;

    if (userInput[userInput.length - 1] !== '/') {
      this.correctFormat = `${userInput}/`;
    }

    if (this.location.toLowerCase() === this.correctFormat.toLowerCase()) {
      return true;
    }

    return false;
  }



  getCarName(): string {
    const carBrand = getRandomElementOfArray(this.carBrands);

    const carModel = getRandomElementOfArray(this.carModels);

    this.carName = `${carBrand} ${carModel}`;

    return this.carName;
  }

  getRGBNumber(): number {
    return Math.trunc(Math.random() * this.rangeRGB);
  }

  getCarColor(): string {
    const red = this.getRGBNumber();

    const green = this.getRGBNumber();

    const blue = this.getRGBNumber();

    return `rgb(${red},${green},${blue})`;
  }

  generateCarData(input: HTMLInputElement, color: HTMLInputElement): IValues {
    const carName = input.value ? input.value : this.getCarName();

    const car = {
      name: carName,
      color: color.value,
    };

    input.value = '';
    color.value = this.defaultColor;

    return car;
  }


}
