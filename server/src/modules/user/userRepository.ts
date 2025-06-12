import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";
import supabase from "../../../database/supabase";

const TABLE_NAME = "user";

type User = {
  id: number;
  email: string;
  password: string;
};

class UserRepository {
  // The Rs of CRUD - Read operations
  async create(user: Omit<User, "id">) {
    // Execute the SQL INSERT query to add a new item to the "item" table
    const [result] = await databaseClient.query<Result>(
      `insert into ${TABLE_NAME} (email, password) values (?, ?)`,
      [user.email, user.password],
    );

    // Return the ID of the newly inserted item
    return result.insertId;
  }

  async readAll() {
    let rows = [];

    if (process.env.NODE_ENV === "DEV") {
      // Execute the SQL SELECT query to retrieve all items from the "item" table
      rows = await databaseClient.query<Rows>(`select * from ${TABLE_NAME}`);
    } else {
      const { data, error } = await supabase.from("item").select("*");

      rows = [data];
    }

    return rows[0] as User[];
  }

  async read(id: number) {
    // Execute the SQL SELECT query to retrieve a specific item by its ID
    const [rows] = await databaseClient.query<Rows>(
      `select * from ${TABLE_NAME} where id = ?`,
      [id],
    );

    // Return the first row of the result, which represents the item
    return rows[0] as User;
  }

  async signIn(email: string, password: string) {
    const [rows] = await databaseClient.query<Rows>(
      `select * from ${TABLE_NAME} where email = ? AND password = ?`,
      [email, password],
    );

    return rows[0] as User;
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing item

  // async update(item: Item) {
  //   ...
  // }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an item by its ID

  // async delete(id: number) {
  //   ...
  // }
}

export default new UserRepository();
