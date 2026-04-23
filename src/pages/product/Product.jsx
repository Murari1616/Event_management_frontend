import ProductCreation from "./ProductCreation"
import ProductList from './ProductList.jsx'

const Product = () => {
    return (
        <div className="w-full h-[88vh] overflow-y-hidden flex bg-white rounded-lg flex-col lg:flex-row md:flex-row">
            {/* ProductCreation: hidden on small screens */}
            <div className="hidden md:block lg:w-2/5 md:w-2/5 w-full pt-2 pl-2">
                <ProductCreation />
            </div>

            {/* ProductList: always visible */}
            <div className="lg:w-3/5 md:w-3/5 w-full">
                <ProductList />
            </div>
        </div>
    )
}

export default Product
