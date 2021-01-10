export interface Account extends AccountCommon {
  createdOn: string;
}

export type AccountCommon = {
  accountId: string;
  organizationId?: string;
};
