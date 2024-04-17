import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('ExpenseManager.db');

const ReoccurrenceRepository = {
    getAllRecurrences: () => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM Recurrences;',
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

export default ReoccurrenceRepository;
