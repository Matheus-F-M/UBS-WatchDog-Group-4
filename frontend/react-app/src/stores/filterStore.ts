import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TransactionFilters {
  id: string;
  idCliente: string;
  tipo: string;
  valor: string;
  moeda: string;
  contraparte: string;
  data: string;
}

interface TransactionVisibleColumns {
  id: boolean;
  idCliente: boolean;
  tipo: boolean;
  valor: boolean;
  moeda: boolean;
  contraparte: boolean;
  hora: boolean;
  data: boolean;
}

interface ClientFilters {
  id: string;
  nome: string;
  cpfCnpj: string;
  pais: string;
  capital: string;
  kycStatus: string;
  nivelDeRisco: string;
}

interface ClientVisibleColumns {
  id: boolean;
  nome: boolean;
  cpfCnpj: boolean;
  pais: boolean;
  capital: boolean;
  kycStatus: boolean;
  nivelDeRisco: boolean;
}

interface AlertFilters {
  id: string;
  idCliente: string;
  idTransacao: string;
  severidade: string;
  status: string;
}

interface AlertVisibleColumns {
  id: boolean;
  idCliente: boolean;
  idTransacao: boolean;
  severidade: boolean;
  status: boolean;
}

interface FilterState {
  // Transaction filters
  transactionFilters: TransactionFilters;
  transactionVisibleColumns: TransactionVisibleColumns;
  
  // Client filters
  clientFilters: ClientFilters;
  clientVisibleColumns: ClientVisibleColumns;
  
  // Alert filters
  alertFilters: AlertFilters;
  alertVisibleColumns: AlertVisibleColumns;
  
  // Actions
  setTransactionFilter: (key: keyof TransactionFilters, value: string) => void;
  setTransactionColumnVisibility: (column: keyof TransactionVisibleColumns, visible: boolean) => void;
  toggleTransactionColumn: (column: keyof TransactionVisibleColumns) => void;
  resetTransactionFilters: () => void;
  
  setClientFilter: (key: keyof ClientFilters, value: string) => void;
  setClientColumnVisibility: (column: keyof ClientVisibleColumns, visible: boolean) => void;
  toggleClientColumn: (column: keyof ClientVisibleColumns) => void;
  resetClientFilters: () => void;
  
  setAlertFilter: (key: keyof AlertFilters, value: string) => void;
  setAlertColumnVisibility: (column: keyof AlertVisibleColumns, visible: boolean) => void;
  toggleAlertColumn: (column: keyof AlertVisibleColumns) => void;
  resetAlertFilters: () => void;
}

const initialTransactionFilters: TransactionFilters = {
  id: '',
  idCliente: '',
  tipo: '',
  valor: '',
  moeda: '',
  contraparte: '',
  data: '',
};

const initialTransactionColumns: TransactionVisibleColumns = {
  id: true,
  idCliente: true,
  tipo: true,
  valor: true,
  moeda: true,
  contraparte: true,
  hora: true,
  data: true,
};

const initialClientFilters: ClientFilters = {
  id: '',
  nome: '',
  cpfCnpj: '',
  pais: '',
  capital: '',
  kycStatus: '',
  nivelDeRisco: '',
};

const initialClientColumns: ClientVisibleColumns = {
  id: true,
  nome: true,
  cpfCnpj: true,
  pais: true,
  capital: true,
  kycStatus: true,
  nivelDeRisco: true,
};

const initialAlertFilters: AlertFilters = {
  id: '',
  idCliente: '',
  idTransacao: '',
  severidade: '',
  status: '',
};

const initialAlertColumns: AlertVisibleColumns = {
  id: true,
  idCliente: true,
  idTransacao: true,
  severidade: true,
  status: true,
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      // Initial transaction state
      transactionFilters: initialTransactionFilters,
      transactionVisibleColumns: initialTransactionColumns,
      
      // Initial client state
      clientFilters: initialClientFilters,
      clientVisibleColumns: initialClientColumns,
      
      // Initial alert state
      alertFilters: initialAlertFilters,
      alertVisibleColumns: initialAlertColumns,
      
      // Transaction actions
      setTransactionFilter: (key, value) =>
        set((state) => ({
          transactionFilters: { ...state.transactionFilters, [key]: value },
        })),
        
      setTransactionColumnVisibility: (column, visible) =>
        set((state) => ({
          transactionVisibleColumns: { ...state.transactionVisibleColumns, [column]: visible },
        })),
        
      toggleTransactionColumn: (column) =>
        set((state) => ({
          transactionVisibleColumns: {
            ...state.transactionVisibleColumns,
            [column]: !state.transactionVisibleColumns[column],
          },
        })),
        
      resetTransactionFilters: () =>
        set({
          transactionFilters: initialTransactionFilters,
        }),
      
      // Client actions
      setClientFilter: (key, value) =>
        set((state) => ({
          clientFilters: { ...state.clientFilters, [key]: value },
        })),
        
      setClientColumnVisibility: (column, visible) =>
        set((state) => ({
          clientVisibleColumns: { ...state.clientVisibleColumns, [column]: visible },
        })),
        
      toggleClientColumn: (column) =>
        set((state) => ({
          clientVisibleColumns: {
            ...state.clientVisibleColumns,
            [column]: !state.clientVisibleColumns[column],
          },
        })),
        
      resetClientFilters: () =>
        set({
          clientFilters: initialClientFilters,
        }),
      
      // Alert actions
      setAlertFilter: (key, value) =>
        set((state) => ({
          alertFilters: { ...state.alertFilters, [key]: value },
        })),
        
      setAlertColumnVisibility: (column, visible) =>
        set((state) => ({
          alertVisibleColumns: { ...state.alertVisibleColumns, [column]: visible },
        })),
        
      toggleAlertColumn: (column) =>
        set((state) => ({
          alertVisibleColumns: {
            ...state.alertVisibleColumns,
            [column]: !state.alertVisibleColumns[column],
          },
        })),
        
      resetAlertFilters: () =>
        set({
          alertFilters: initialAlertFilters,
        }),
    }),
    {
      name: 'filter-storage', // localStorage key
    }
  )
);
