export interface ICreateTransaction {
  userId: string;
  categoryId: string;
  amount: string;
  currecyId: string;
  date: string;
  note: string;
  createdOn: string;
}

export interface ITransaction {
  categoryId: string;
  amount: string;
  currecyId: string;
  date: string;
  note: string;
}
