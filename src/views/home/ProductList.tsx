import { useEffect, useState } from 'react'
import type { Product } from '../../models/Product'
import { supabaseService, type ProductRow } from '../../services/SupabaseService'

type ProductListProps = {
	onSelectProduct: (product: Product) => void
	onAddToCart: (product: Product) => void
	onProductsLoaded: (products: Product[]) => void
}

export default function ProductList({ onSelectProduct, onAddToCart, onProductsLoaded }: ProductListProps) {
	const [products, setProducts] = useState<Product[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [errorMessage, setErrorMessage] = useState('')

	useEffect(() => {
		const loadProducts = async () => {
			const { data, error } = await supabaseService.getProducts()
			if (error) {
				setErrorMessage(error.message)
				setIsLoading(false)
				return
			}

			const loadedProducts = (data ?? []).map(toProduct)
			setProducts(loadedProducts)
			onProductsLoaded(loadedProducts)
			setIsLoading(false)
		}

		void loadProducts()
	}, [onProductsLoaded])

	if (isLoading) return <section className="product-section"><p>Loading products...</p></section>
	if (errorMessage) return <section className="product-section"><p className="auth-error" role="alert">Unable to load products: {errorMessage}</p></section>

	return (
		<section className="product-section" aria-labelledby="products-title">
			<div className="category-list" aria-label="Product categories">
				<button className="category active" type="button">All products</button>
				<button className="category" type="button">Produce</button>
				<button className="category" type="button">Bakery</button>
				<button className="category" type="button">Pantry</button>
			</div>
			<div className="product-list">
				{products.map((product) => (
					<article
						className="product-card"
						key={product.id ?? product.name}
						tabIndex={0}
						aria-label={`View details for ${product.name}`}
						onClick={() => onSelectProduct(product)}
						onKeyDown={(event) => {
							if (event.key === 'Enter' || event.key === ' ') onSelectProduct(product)
						}}
					>
						<div className={`product-image ${product.color}`}>
							{product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : product.icon}
						</div>
						<div className="product-info">
							<h2>{product.name}</h2>
							<div className="product-footer">
								<strong>{product.price}</strong><span> / {product.unit}</span>
								<button
									className="add-button"
									type="button"
									aria-label={`Add ${product.name} to cart`}
									onClick={(event) => { event.stopPropagation(); onAddToCart(product) }}
								>+</button>
							</div>
						</div>
					</article>
				))}
			</div>
		</section>
	)
}

function toProduct(product: ProductRow): Product {
	return {
		id: product.id,
		name: product.name,
		category: 'All products',
		price: `$${Number(product.price).toFixed(2)}`,
		unit: 'each',
		color: 'green',
		icon: '🛍️',
		imageUrl: product.image_url ?? undefined,
		description: product.description ?? 'A fresh choice from Stenson Market.',
		rating: 0,
		reviewCount: 0,
		origin: 'Stenson Market',
		testimonials: [],
	}
}
