import pool from "../../../lib/db";

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query("SELECT * FROM nexttodos");
      return new Response(JSON.stringify(result.rows), { status: 200 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching todos:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  try {
    const { task, due_date, priority, user_id } = await request.json();

    if (!task || !due_date || !priority || !user_id) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO nexttodos (task, due_date, priority, user_id) VALUES ($1, $2, $3, $4) RETURNING *`,
        [task, new Date(due_date), priority, user_id]
      );
      const newTodo = result.rows[0];
      return new Response(JSON.stringify(newTodo), { status: 201 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error adding todo:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
