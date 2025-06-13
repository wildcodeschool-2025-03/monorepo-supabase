import databaseClient from "../../../database/client";
import type {Result, Rows} from "../../../database/client";
import supabase from "../../../database/supabase";

const TABLE_NAME = "item";
const TABLE_USER = "user";
const TABLE_JOINTURE = "user_item";

type Item = {
    id: number;
    title: string;
    user_id?: number;
};

class ItemRepository {
    // The C of CRUD - Create operation

    async create(item: Omit<Item, "id">) {
        // Execute the SQL INSERT query to add a new item to the "item" table
        const [result] = await databaseClient.query<Result>(
            `insert into ${TABLE_NAME} (title, user_id)
             values (?, ?)`,
            [item.title, item.user_id],
        );

        // Return the ID of the newly inserted item
        return result.insertId;
    }

    // The Rs of CRUD - Read operations

    async read(id: number) {
        // Execute the SQL SELECT query to retrieve a specific item by its ID
        const [rows] = await databaseClient.query<Rows>(
            `select *
             from ${TABLE_NAME}
             where id = ?`,
            [id],
        );

        // Return the first row of the result, which represents the item
        return rows[0] as Item;
    }

    async joint() {
        // Execute the SQL SELECT query to retrieve all items from the "item" table
        const [rows] = await databaseClient.query<Rows>(`SELECT *
                                                         FROM ${TABLE_NAME} T
                                                                  JOIN ${TABLE_USER} U ON T.user_id = U.id`);
        // Return the array of items
        return rows as Item[];
    }

    async readAll() {
        let rows = [];

        if (process.env.NODE_ENV === "DEV") {
            // Execute the SQL SELECT query to retrieve all items from the "item" table
            rows = await databaseClient.query<Rows>(`select *
                                                     from ${TABLE_NAME}`);
        } else {
            const {data, error} = await supabase.from("item").select("*");

            rows = [data];
        }

        return rows[0] as Item[];
    }

    // The U of CRUD - Update operation
    // TODO: Implement the update operation to modify an existing item

    // async update(item: Item) {
    //   ...
    // }

    // The D of CRUD - Delete operation
    // TODO: Implement the delete operation to remove an item by its ID

    async destroy(id: number) {
        // Execute the SQL SELECT query to retrieve a specific item by its ID
        const [result] = await databaseClient.query<Rows>(
            `delete
             from ${TABLE_NAME}
             where id = ?`,
            [id],
        );

        // Return the first row of the result, which represents the item
        return result.affectedRows;
    }

    async update(item: Item) {
        // Execute the SQL UPDATE query to modify an existing item in the "item" table
        const [result] = await databaseClient.query<Result>(
            `update ${TABLE_NAME}
             set title = ?
             where id = ?`,
            [item.title, item.id],
        );

        // Return the number of affected rows
        return result.affectedRows;
    }
}

export default new ItemRepository();
