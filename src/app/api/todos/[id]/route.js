// import pool from "../../../lib/db";

import pool from "@/lib/db";
// Correct path
// import path from "path";
// import pool from "lib/db";

// console.log("Current Directory:", __dirname);
// console.log("File Path:", path.resolve(__dirname, "../../../lib/db.js"));
export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const { task, due_date, priority } = await request.json();

    if (!task || !due_date || !priority) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE nexttodos SET task = $1, due_date = $2, priority = $3 WHERE id = $4 RETURNING *`,
        [task, new Date(due_date), priority, id]
      );
      const updatedTodo = result.rows[0];
      return new Response(JSON.stringify(updatedTodo), { status: 200 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error updating todo:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `DELETE FROM nexttodos WHERE id = $1 RETURNING *`,
        [id]
      );
      const deletedTodo = result.rows[0];
      if (!deletedTodo) {
        return new Response(JSON.stringify({ message: "Todo not found" }), {
          status: 404,
        });
      }
      return new Response(JSON.stringify(deletedTodo), { status: 200 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
