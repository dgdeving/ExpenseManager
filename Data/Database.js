import * as SQLite from 'expo-sqlite';

let db = SQLite.openDatabase('ExpenseManager.db');

// Setup with Validation

const createTablesWithValidation = (callback) => {
    const logs = []; // Array to store success or error messages

    db = SQLite.openDatabase('ExpenseManager.db');

    db.transaction((tx) => {
        tx.executeSql('PRAGMA foreign_keys = ON;');

        // Table creation functions
        const tableCreationFunctions = [
            {
                tableName: 'Categories',
                sql: `CREATE TABLE "Categories" (
                        "id"	INTEGER,
                        "name"	TEXT NOT NULL,
                        PRIMARY KEY("id" AUTOINCREMENT)
                    );`
            },
            {
                tableName: 'Recurrences',
                sql: `CREATE TABLE "Recurrences" (
                        "id"	INTEGER,
                        "type"	TEXT NOT NULL,
                        PRIMARY KEY("id" AUTOINCREMENT)
                    );`
            },
            {
                tableName: 'Incomes',
                sql: `CREATE TABLE "Incomes" (
                        "id"	INTEGER,
                        "amount"	REAL NOT NULL,
                        "description"	TEXT NOT NULL,
                        "date"	DATE NOT NULL,
                        "recurrence_id"	INTEGER NOT NULL,
                        FOREIGN KEY("recurrence_id") REFERENCES "Recurrences"("id") ON UPDATE CASCADE ON DELETE SET NULL,
                        PRIMARY KEY("id" AUTOINCREMENT)
                    );`
            },
            {
                tableName: 'Expenses',
                sql: `CREATE TABLE "Expenses" (
                        "id"	INTEGER,
                        "amount"	REAL NOT NULL,
                        "description"	TEXT NOT NULL,
                        "date" DATE NOT NULL,
                        "category_id"	INTEGER NOT NULL,
                        "recurrence_id"	INTEGER NOT NULL,
                        FOREIGN KEY("recurrence_id") REFERENCES "Recurrences"("id") ON UPDATE CASCADE ON DELETE SET NULL,
                        FOREIGN KEY("category_id") REFERENCES "Categories"("id") ON UPDATE CASCADE ON DELETE SET NULL,
                        PRIMARY KEY("id" AUTOINCREMENT)
                    );`
            }
        ];

        tableCreationFunctions.forEach((tableInfo) => {
            tx.executeSql(
                tableInfo.sql,
                [],
                (_, results) => {
                    logs.push(`${tableInfo.tableName} table created successfully.`);
                },
                (error) => {
                    logs.push(`Error creating ${tableInfo.tableName} table: ${error}`);
                }
            );
        });
    }, (error) => {
        console.error('Transaction error:', error);
        callback(false); // Indicate failure to create tables
    }, () => {
        console.log('Transaction completed successfully.');

        // Check if there are any error logs, if not, tables were created successfully
        const isSuccess = !logs.some(log => log.startsWith('Error'));

        if (isSuccess) {
            callback(true); // Indicate success
        } else {
            logs.forEach(log => console.error(log)); // Log errors
            callback(false); // Indicate failure due to errors
        }
    });
};

const insertInitialDataWithValidation = (callback) => {
    const logs = []; // Array to store success or error messages

    db.transaction((tx) => {
        // Insert records into the Recurrences table
        tx.executeSql(
            `INSERT INTO Recurrences (type) VALUES (?), (?), (?)`,
            ['Once', 'Daily', 'Monthly'],
            (_, results) => {
                logs.push('Records inserted into Recurrences table.');
            },
            (error) => {
                logs.push(`Error inserting records into Recurrences table: ${error}`);
            }
        );

        // Insert records into the Categories table
        tx.executeSql(
            `INSERT INTO Categories (name) VALUES (?), (?), (?), (?), (?), (?)`,
            ['food', 'rent', 'house bills', 'car bills', 'gadgets', 'clothing'],
            (_, results) => {
                logs.push('Records inserted into Categories table.');
            },
            (error) => {
                logs.push(`Error inserting records into Categories table: ${error}`);
            }
        );
    }, (error) => {
        console.error('Transaction error:', error);
        callback(false); // Indicate failure to insert initial data
    }, () => {
        console.log('Initial data insertion completed successfully.');

        // Check if there are any error logs, if not, initial data inserted successfully
        const isSuccess = !logs.some(log => log.startsWith('Error'));

        if (isSuccess) {
            callback(true); // Indicate success
        } else {
            logs.forEach(log => console.error(log)); // Log errors
            callback(false); // Indicate failure due to errors
        }
    });
};

export const setupDatabaseWithValidation = (callback) => {
    createTablesWithValidation((tablesCreated) => {
        if (tablesCreated) {
            insertInitialDataWithValidation((dataInserted) => {
                if (dataInserted) {
                    // Both tables created and initial data inserted successfully
                    callback(true); // Indicate overall success
                } else {
                    // Initial data insertion failed
                    callback(false); // Indicate failure
                }
            });
        } else {
            // Table creation failed
            callback(false); // Indicate failure
        }
    });
};





// Setup without Validation
const createTables = () => {
    db.transaction((tx) => {
        tx.executeSql('PRAGMA foreign_keys = ON;');


        // Create the Categories table
        tx.executeSql(
            `CREATE TABLE "Categories" (
                "id"	INTEGER,
                "name"	TEXT NOT NULL,
                PRIMARY KEY("id" AUTOINCREMENT)
            );
        `,
            [],
            (tx, results) => {
                console.log('Categories table created successfully.');
            },
            (error) => {
                console.error('Error creating Categories table:', error);
            }
        );

        // Create the Recurrences table
        tx.executeSql(
            `CREATE TABLE "Recurrences" (
                "id"	INTEGER,
                "type"	TEXT NOT NULL,
                PRIMARY KEY("id" AUTOINCREMENT)
            );
        `,
            [],
            (tx, results) => {
                console.log('Recurrences table created successfully.');
            },
            (error) => {
                console.error('Error creating Recurrences table:', error);
            }
        );

        // Create the Incomes table
        tx.executeSql(
            `CREATE TABLE "Incomes" (
                "id"	INTEGER,
                "amount"	REAL NOT NULL,
                "description"	TEXT NOT NULL,
                "date"	TEXT NOT NULL,
                "reocurrence_id"	INTEGER NOT NULL,
                FOREIGN KEY("reocurrence_id") REFERENCES "Recurrences"("id") ON UPDATE CASCADE ON DELETE SET NULL,
                PRIMARY KEY("id" AUTOINCREMENT)
            );
        `,
            [],
            (tx, results) => {
                console.log('Incomes table created successfully.');

            },
            (error) => {
                console.error('Error creating Incomes table:', error);
            }
        );

        // Create the Expenses table
        tx.executeSql(
            `CREATE TABLE "Expenses" (
                "id"	INTEGER,
                "amount"	REAL NOT NULL,
                "description"	TEXT NOT NULL,
                "category_id"	INTEGER NOT NULL,
                "reocurrence_id"	INTEGER NOT NULL,
                FOREIGN KEY("reocurrence_id") REFERENCES "Recurrences"("id") ON UPDATE CASCADE ON DELETE SET NULL,
                FOREIGN KEY("category_id") REFERENCES "Categories"("id") ON UPDATE CASCADE ON DELETE SET NULL,
                PRIMARY KEY("id" AUTOINCREMENT)
            );
        `,
            [],
            (tx, results) => {
                console.log('Expenses table created successfully.');
            },
            (error) => {
                console.error('Error creating Expenses table:', error);
            }
        );


    });
};

const insertInitialData = () => {
    db.transaction((tx) => {
        // Insert records into the Recurrences table
        tx.executeSql(
            `INSERT INTO Recurrences (type) VALUES (?), (?), (?)`,
            ['Once', 'Daily', 'Monthly'],
            (tx, results) => {
                console.log('Records inserted into Recurrences table.');
            },
            (error) => {
                console.error('Error inserting records into Recurrences table:', error);
            }
        );

        // Insert records into the Categories table
        tx.executeSql(
            `INSERT INTO Categories (name) VALUES (?), (?), (?), (?), (?), (?)`,
            ['food', 'rent', 'house bills', 'car bills', 'gadgets', 'clothing'],
            (tx, results) => {
                console.log('Records inserted into Categories table.');
            },
            (error) => {
                console.error('Error inserting records into Categories table:', error);
            }
        );
    });
};

export const setupDatabase = () => {

    createTables();
    insertInitialData();

};

// Utils
export const listDBDetails = () => {
    db.transaction((tx) => {
        tx.executeSql(
            'PRAGMA database_list;',
            [],
            (tx, results) => {
                const databaseList = results.rows;
                console.log('List of attached databases:', databaseList);
            },
            (error) => {
                console.error('Error listing attached databases:', error);
            }
        );
    });
};

export const listTables = () => {
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT name FROM sqlite_master WHERE type="table";',
            [],
            (tx, results) => {
                const tables = results.rows;
                console.log('List of tables:', tables);
            },
            (error) => {
                console.error('Error listing tables:', error);
            }
        );
    });
};

export const inspectTableSchema = (tableName) => {
    db.transaction((tx) => {
        tx.executeSql(
            `PRAGMA table_info(${tableName});`,
            [],
            (tx, results) => {
                const tableInfo = results.rows._array;
                console.log(`Schema of table ${tableName}:`, tableInfo);
            },
            (error) => {
                console.error(`Error inspecting table schema for ${tableName}:`, error);
            }
        );
    });
};

export const inspectForeignKeys = (tableName) => {
    db.transaction((tx) => {
        tx.executeSql(
            `PRAGMA foreign_key_list(${tableName});`,
            [],
            (tx, results) => {
                const foreignKeys = results.rows._array;
                console.log(`Foreign keys of table ${foreignKeys}:`, foreignKeys);
            },
            (error) => {
                console.error(`Error inspecting foreign keys of ${foreignKeys}:`, error);
            }
        );
    });
};

export async function closeDatabase() {
    try {
        await db.closeAsync();
        console.log(`Database closed successfully.`);
    } catch (error) {
        console.error(`Error closing database: ${error.message}`);
    }
};

export async function deleteDatabase() {
    try {
        await db.deleteAsync();
        console.log(`Database deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting database: ${error.message}`);
    }
};


export function debugDatabase() {
    db.transaction((tx) => {
        // Query data from the Incomes table
        tx.executeSql('SELECT * FROM Incomes', [], (_, { rows }) => {
            const incomeData = rows._array;
            console.log('Incomes:', rows._array);

        });

        // Query data from the Expenses table
        tx.executeSql('SELECT * FROM Expenses', [], (_, { rows }) => {
            const expenseData = rows._array;
            console.log('Expenses:', expenseData);
        });

        // Query data from the Categories table
        tx.executeSql('SELECT * FROM Categories', [], (_, { rows }) => {
            const categoryData = rows._array;
            console.log('Categories:', categoryData);
        });

        // Query data from the Recurrences table
        tx.executeSql('SELECT * FROM Recurrences', [], (_, { rows }) => {
            const recurrenceData = rows._array;
            console.log('Recurrences:', recurrenceData);
        });
    });
};


