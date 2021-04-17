export interface Account {
    account_id: string,
    account_data: {
      account_balance?: number;
      account_number?: number;
      class_name?: string;
      icon_image?: string
      name_account?: string;
      propietary_name?: string;
      type_account?: string;
    }
  }