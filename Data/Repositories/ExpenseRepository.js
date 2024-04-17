import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('ExpenseManager.db');

const ExpenseRepository = {
    createExpense: (description, date, amount, categoryId, reoccurrenceId) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'INSERT INTO Expenses (description, date, amount, category_id, recurrence_id) VALUES (?, ?, ?, ?, ?)',
                    [description, date, amount, categoryId, reoccurrenceId],
                    (_, results) => {
                        resolve(results.insertId); // Return the ID of the inserted expense
                    },
                    (_, error) => {
                        console.error('Error creating expense:', error); // Log the SQL error
                        reject(error);
                    }
                );
            });
        });
    },

    getExpenseById: (id) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM Expenses WHERE id = ?;',
                    [id],
                    (_, { rows }) => {
                        resolve(rows._array);
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            });
        });
    },

    getAllExpensesWithDetails: () => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    `SELECT e.id, e.description, e.date, e.amount, c.name AS category, r.type AS recurrence
                    FROM Expenses e
                    LEFT JOIN Categories c ON e.category_id = c.id
                    LEFT JOIN Recurrences r ON e.recurrence_id = r.id`,
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
    },

    getAllExpensesWithDetailsByMonth: (yearMonth) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                // Ensure the input is split into year and month for filtering
                const [year, month] = yearMonth.split('-');

                tx.executeSql(
                    `SELECT e.id, e.description, e.date, e.amount, c.name AS category, r.type AS recurrence
                    FROM Expenses e
                    LEFT JOIN Categories c ON e.category_id = c.id
                    LEFT JOIN Recurrences r ON e.recurrence_id = r.id
                    WHERE strftime('%Y', e.date) = ? AND strftime('%m', e.date) = ?`,
                    [year, month],
                    (_, { rows }) => {
                        resolve(rows._array);
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            });
        });
    },

    // getAllExpensesWithDetailsByMonth: (yearMonth) => {
    //     return new Promise((resolve, reject) => {
    //         db.transaction((tx) => {
    //             // Ensure the input is split into year and month for filtering
    //             const [year, month] = yearMonth.split('-');

    //             tx.executeSql(
    //                 `SELECT e.id, e.description, e.date, e.amount, c.name AS category, r.type AS recurrence
    //                 FROM Expenses e
    //                 LEFT JOIN Categories c ON e.category_id = c.id
    //                 LEFT JOIN Recurrences r ON e.recurrence_id = r.id
    //                 WHERE e.date >= '2024-03-01' AND e.date < '2024-04-01'`,

    //                 [],
    //                 (_, { rows }) => {
    //                     resolve(rows._array);
    //                 },
    //                 (_, error) => {
    //                     reject(error);
    //                 }
    //             );
    //         });
    //     });
    // },





    getAllExpenses: () => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM Expenses;',
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
    },

    deleteExpense: (id) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'DELETE FROM Expenses WHERE id = ?',
                    [id],
                    (_, results) => {
                        resolve(results.rowsAffected);
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            });
        });
    },

    updateExpense: (id, description, date, amount, categoryId, reoccurrenceId) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'UPDATE Expenses SET description = ?, date = ?, amount = ?, category_id = ?, recurrence_id = ? WHERE id = ?',
                    [description, date, amount, categoryId, reoccurrenceId, id],
                    (_, results) => {
                        resolve(results.rowsAffected);
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            });
        });
    }

};

export default ExpenseRepository;
