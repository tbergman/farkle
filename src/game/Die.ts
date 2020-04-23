/**
 *
 *
 */
export type DieValue = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type DiceValueArray = Array<DieValue>

export class Die {
  private _id: number;
  private _value: DieValue;

  get value(): DieValue {
    return this._value
  }

  get id() {
    return this._id;
  }

  constructor(id: number, value?:DieValue) {
    this._id = id;
    this._value = value || 0
  }

  roll() {
    this._value = (Math.round(Math.random() * 5) + 1) as DieValue;
    return this._value
  }
}
