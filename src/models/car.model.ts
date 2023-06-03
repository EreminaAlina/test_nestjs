export class Cars {
  id: string;
  rentId: string;
  regNumber: string;

  constructor(id: string, rentId: string, regNumber: string) {
    this.id = id;
    this.rentId = rentId;
    this.regNumber = regNumber;
  }
}
