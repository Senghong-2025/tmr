import textHelper from "@/helpers/textHelper";
export interface ICreateTransaction {
  userId: string;
  title: string;
  category: string;
  amount: string;
  currency: string;
  type: string;
  date: string;
  note: string;
  createdOn: string;
  modifiedOn: string;
}
  
export interface ITransaction {
  id: string;
  category: string;
  title: string;
  type: string
  amount: string;
  currency: string;
  date: string;
  note: string;
}

export class Transaction implements ITransaction {
  id!: string;
  category!: string;
  title!: string;
  type!: string;
  amount!: string;
  currency!: string;
  date!: string;
  note!: string;

  constructor(init: ITransaction) {
    Object.assign(this, init);
  }

  get amountForDisplay(){
    return textHelper.convertAmountWithoutRouteUp(Number(this.amount));
  };
}

export interface ITransactionGroupDisplay {
  date: string;
  transactions: Transaction[];
  totalAmount: number;
  totalAmountKhr?: number;
}
