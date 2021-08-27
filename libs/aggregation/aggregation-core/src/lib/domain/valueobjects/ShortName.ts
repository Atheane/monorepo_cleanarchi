export class ShortName {
  private readonly name: string;

  constructor(name: string) {
    if (name.length > 15) {
      this.name = name.slice(0, 12) + '...';
    } else {
      this.name = name;
    }
  }
  get value(): string {
    return this.name;
  }
}
