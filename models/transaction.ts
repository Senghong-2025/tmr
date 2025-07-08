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
  category: string;
  title: string;
  type: string
  amount: string;
  currency: string;
  date: string;
  note: string;
}
