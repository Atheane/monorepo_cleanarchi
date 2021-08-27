export class ContractNumber {
  private readonly generatedValue: string;

  constructor(letterMax: number, numberMax: number) {
    this.generatedValue = this.generate(letterMax, numberMax);
  }

  private generate(letterMax: number, numberMax: number): string {
    const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode('a'.charCodeAt(0) + i));
    const suiteNumber = Array.from({ length: 10 }, (_, i) => String.fromCharCode('0'.charCodeAt(0) + i));
    const generateId = [];

    for (let i = 0; i < letterMax; i += 1) {
      generateId.push(alphabet[Math.floor(letterMax * Math.random())]);
    }

    for (let i = 0; i < numberMax; i += 1) {
      generateId.push(suiteNumber[Math.floor(numberMax * Math.random())]);
    }

    return generateId.join('').toUpperCase();
  }

  get value(): string {
    return this.generatedValue;
  }
}
