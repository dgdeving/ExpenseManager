import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('ExpenseManager.db');

const IncomeRepository = {
    getAllIncomes: () => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM Incomes;',
                    [],
                    (_, { rows }) => {
                        resolve(rows._array);
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            });
        });
    }
};

export default IncomeRepository;
