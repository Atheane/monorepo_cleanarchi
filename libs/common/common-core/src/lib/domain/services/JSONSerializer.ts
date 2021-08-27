export class JSONConvert {
  static serialize(data: any): string {
    return JSON.stringify(data);
  }

  static deserialize<T extends any>(data: string): T {
    return JSON.parse(data);
  }
}
