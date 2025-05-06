"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom"
import ProductCard from "../Route/ProductCard/ProductCard"
import { backend_url } from "../../server"
import Ratings from "../Products/Ratings"
import { getAllEventsShop } from "../../redux/actions/event"

const ShopProfileData = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products)
  const { events } = useSelector((state) => state.events)
  const { seller } = useSelector((state) => state.seller)
  const { id } = useParams()

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getAllEventsShop(seller._id))
  }, [dispatch])

  const [active, setActive] = useState(1)

  const allReviews = products && products.flatMap((product) => product.reviews)

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 mb-4">
        <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
          <button
            className={`text-base font-medium ${
              active === 1 ? "text-crimson border-b-2 border-crimson" : "text-gray-600 hover:text-gray-800"
            } transition-colors pb-1`}
            onClick={() => setActive(1)}
          >
            Shop Products
          </button>

          <button
            className={`text-base font-medium ${
              active === 2 ? "text-crimson border-b-2 border-crimson" : "text-gray-600 hover:text-gray-800"
            } transition-colors pb-1`}
            onClick={() => setActive(2)}
          >
            Running Events
          </button>

          <button
            className={`text-base font-medium ${
              active === 3 ? "text-crimson border-b-2 border-crimson" : "text-gray-600 hover:text-gray-800"
            } transition-colors pb-1`}
            onClick={() => setActive(3)}
          >
            Shop Reviews
          </button>
        </div>

        {isOwner && (
          <Link to="/dashboard">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">
              Go to Dashboard
            </button>
          </Link>
        )}
      </div>

      {active === 1 && (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
          {products && products.length > 0 ? (
            products.map((i, index) => <ProductCard data={i} key={index} isShop={true} />)
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">No products available for this shop.</div>
          )}
        </div>
      )}

      {active === 2 && (
        <div className="w-full">
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
            {events && events.length > 0 ? (
              events.map((i, index) => <ProductCard data={i} key={index} isShop={true} isEvent={true} />)
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">No events available for this shop.</div>
            )}
          </div>
        </div>
      )}

      {active === 3 && (
        <div className="w-full">
          {allReviews && allReviews.length > 0 ? (
            <div className="space-y-6">
              {allReviews.map((item, index) => (
                <div key={index} className="flex p-4 border rounded-lg hover:bg-gray-50">
                  <img
                    src={`${item.user.avatar}`}
                    className="w-[50px] h-[50px] rounded-full object-cover"
                    alt="User Avatar"
                  />
                  <div className="ml-4">
                    <div className="flex items-center mb-1">
                      <h3 className="font-medium text-gray-800 mr-2">{item.user.name}</h3>
                      <Ratings rating={item.rating} />
                    </div>
                    <p className="text-gray-600 mb-2">{item?.comment}</p>
                    <p className="text-gray-400 text-sm">{item.createdAt.substring(0, 10)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No reviews available for this shop.</div>
          )}
        </div>
      )}
    </div>
  )
}

export default ShopProfileData

