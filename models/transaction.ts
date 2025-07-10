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

export interface ITransactionGroupDisplay {
  date: string;
  transactions: ITransaction[];
  totalAmount: number;
  totalAmountKhr?: number;
}
