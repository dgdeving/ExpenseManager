// CategoryRepository.js
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('ExpenseManager.db');

const CategoryRepository = {
    getAllCategories: () => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM Categories;',
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

export default CategoryRepository;
