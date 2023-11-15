import { filter } from 'better-sqlite3-proxy'
import { proxy } from '../../../db/proxy.js'
import { mapArray } from '../components/fragment.js'
import Style from '../components/style.js'
import { o } from '../jsx/jsx.js'
import { Context, DynamicContext } from '../context.js'
import { Link } from '../components/router.js'

let style = Style(/* css */ `
header {
  display: flex;
  font-size: 1.5rem;
  align-items: center;
}
header img {
  height: 3rem;
}
header div {
  flex-grow: 1;
  text-align: center;
}
#foodList {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.food {
  border: 1px solid red;
  border-radius: 1rem;
  width: fit-content;
  margin: 0.5rem;
  overflow: hidden;
}
.food img {
  width: 200px;
  height: 200px;
}
.food-name {
  margin: 1rem;
  margin-top: 0;
  margin-bottom: 0;
}
.food-price {
  margin: 1rem;
  margin-top: 0;
}
`)

let content = (
  <div>
    {style}
    <header>
      <img src="logo-small.webp" />
      <div>ABC Restaurant</div>
    </header>
    <Main />
  </div>
)

function Main(attrs: {}, context: DynamicContext) {
  let category_id = 1

  let params = new URLSearchParams(context.routerMatch?.search)
  let id = params.get('category_id')
  if (id) {
    category_id = +id
  }

  let selectedCategoryName = proxy.category[category_id].name

  let foods = filter(proxy.food, { category_id })
  return (
    <>
      <div id="categoryList">
        {mapArray(proxy.category, category => (
          <Link href={'/menu?category_id=' + category.id}>
            <button>{category.name}</button>
          </Link>
        ))}
      </div>
      <div id="foodList">
        {foods.length == 0 ? (
          <>
            <p>
              No{' '}
              <span style="text-transform:lowercase">
                {selectedCategoryName}
              </span>{' '}
              available at the moment.
            </p>
            <p>Check again later.</p>
          </>
        ) : null}
        {mapArray(foods, food => (
          <div class="food">
            <img src={food.image_url} />
            <div class="food-name">{food.name}</div>
            <div class="food-price">${food.price}</div>
          </div>
        ))}
      </div>
    </>
  )
}

export default content
