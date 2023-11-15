import { proxy } from './proxy'

// You can setup the database with initial config and sample data via the db proxy.

proxy.category[1] = { name: 'Main Dish' }
proxy.category[2] = { name: 'Drink' }
proxy.category[3] = { name: 'Snack' }
proxy.category[4] = { name: 'Dessert' }

proxy.food[1] = {
  category_id: 1,
  name: 'Beef Steak',
  price: 80,
  image_url: 'https://picsum.photos/seed/steak/200/200',
}
proxy.food[2] = {
  category_id: 1,
  name: 'Beef Salad',
  price: 32,
  image_url: 'https://picsum.photos/seed/salad/200/200',
}

proxy.food[3] = {
  category_id: 2,
  name: 'Beef Blood Juice',
  price: 18,
  image_url: 'https://picsum.photos/seed/juice/200/200',
}
proxy.food[4] = {
  category_id: 2,
  name: 'Beef Blood Juice',
  price: 12,
  image_url: 'https://picsum.photos/seed/milk/200/200',
}
