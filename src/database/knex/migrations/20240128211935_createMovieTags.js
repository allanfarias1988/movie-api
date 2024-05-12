export const up = async (knex) => {
  await knex.schema.createTable("movieTags", (table) => {
    table.increments("id").primary();
    table
        .integer("note_id")
        .references("id")
        .inTable("movieNotes")
        .onDelete("cascade");
    table
        .string("user_id")
        .references("uuid")
        .inTable("users")
        .onDelete("cascade");
    table.string("name").notNullable();
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists("movieTags");
};