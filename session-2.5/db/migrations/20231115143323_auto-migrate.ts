import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('category'))) {
    await knex.schema.createTable('category', table => {
      table.increments('id')
      table.text('name').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('food'))) {
    await knex.schema.createTable('food', table => {
      table.increments('id')
      table.text('name').notNullable()
      table.specificType('price', 'real').notNullable()
      table.text('image_url').notNullable()
      table
        .integer('category_id')
        .unsigned()
        .notNullable()
        .references('category.id')
      table.timestamps(false, true)
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('food')
  await knex.schema.dropTableIfExists('category')
}
