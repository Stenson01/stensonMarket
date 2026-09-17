import { useState } from 'react'

type MyTopAppBarProps = {
	cartCount: number
	userName: string
	isAuthenticated: boolean
	onOpenCart: () => void
	onOpenProfile: () => void
	onLogout: () => void
	onOpenOrders: () => void
	onOpenPolicy: () => void
	onOpenHelp: () => void
}

export default function MyTopAppBar({ cartCount, userName, isAuthenticated, onOpenCart, onOpenProfile, onLogout, onOpenOrders, onOpenPolicy, onOpenHelp }: MyTopAppBarProps) {
	const [menuOpen, setMenuOpen] = useState(false)
	const profileInitial = userName.trim().charAt(0).toUpperCase() || 'A'

	const handleMenuAction = (action: () => void) => {
		setMenuOpen(false)
		action()
	}

	return (
		<header className="top-app-bar">
			<button className="icon-button" type="button" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((isOpen) => !isOpen)}>
				&#9776;
			</button>
			{menuOpen && (
				<nav className="app-menu" aria-label="Main menu">
					<button type="button" onClick={() => handleMenuAction(onOpenProfile)}>Profile</button>
					<button type="button" onClick={() => handleMenuAction(onOpenOrders)}>Your orders</button>
					<button type="button" onClick={() => handleMenuAction(onOpenCart)}>Shopping cart</button>
					<button type="button" onClick={() => handleMenuAction(onOpenPolicy)}>Delivery policy</button>
					<button type="button" onClick={() => handleMenuAction(onOpenHelp)}>Help &amp; support</button>
				</nav>
			)}
			<div className="business-brand">
				<span className="brand-mark" aria-hidden="true">SM</span>
				<div>
					<strong>Stenson Market</strong>
					<span>Fresh choices, every day</span>
				</div>
			</div>
			<label className="search-bar">
				<span aria-hidden="true">&#128269;</span>
				<input type="search" placeholder="Search products" aria-label="Search products" />
			</label>
			<button className="icon-button cart-button" type="button" aria-label="Shopping cart" onClick={onOpenCart}>
				&#128722;{cartCount > 0 && <span className="cart-count">{cartCount}</span>}
			</button>
			<button className="profile-button" type="button" aria-label={isAuthenticated ? 'Log out' : 'Open profile'} onClick={isAuthenticated ? onLogout : onOpenProfile}>
				{isAuthenticated ? <span aria-hidden="true">&#10162;</span> : <span className="profile-avatar">{profileInitial}</span>}
				<span className="profile-name">{isAuthenticated ? 'Log out' : userName}</span>
			</button>
		</header>
	)
}
