export const up = async (knex) => {
  await knex.schema.createTable("movieNotes", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.string("description").notNullable();
    table.integer("rating").notNullable();
    table
      .string("user_id")
      .references("uuid")
      .inTable("users")
      .onDelete("cascade");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists("movieNotes");
};
