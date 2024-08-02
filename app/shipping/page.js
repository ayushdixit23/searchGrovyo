import React from "react";

const page = () => {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-6">Grovyo Shipping Policy</h1>

			<section className="mb-8">
				<h2 className="text-2xl font-semibold mb-4">Shipping and Delivery</h2>
				<div className="space-y-4">
					<div>
						<h3 className="text-xl font-medium">1. Processing Time</h3>
						<p>All orders will be processed and shipped within 48 hours of purchase. Delivery times may vary based on location and shipping method.</p>
					</div>
					<div>
						<h3 className="text-xl font-medium">2. Shipping Methods</h3>
						<p>We use our own infrastructure for deliveries within India. Deliveries outside of India will be handled directly by the sellers. Please note that international delivery times and policies may vary based on the seller’s location and shipping method used.</p>
					</div>
					<div>
						<h3 className="text-xl font-medium">3. Shipping Charges</h3>
						<p>Shipping charges are determined based on the delivery location and shipping method selected at checkout. Users will be informed of the shipping charges before completing their purchase.</p>
					</div>
					<div>
						<h3 className="text-xl font-medium">4. Shipping Delays</h3>
						<p>While we strive to ensure timely delivery, unforeseen circumstances such as weather, strikes, or other disruptions may cause delays. We will notify you of any significant delays affecting your order.</p>
					</div>
					<div>
						<h3 className="text-xl font-medium">5. Delivery Confirmation</h3>
						<p>Once your order is shipped, you will receive a shipping confirmation email with tracking information (if applicable) to monitor the status of your delivery.</p>
					</div>
					<div>
						<h3 className="text-xl font-medium">6. Delivery Issues</h3>
						<p>If you encounter any issues with your delivery, such as missing items or damaged goods, please contact our customer support team at <a href="mailto:support@grovyo.com" className="text-blue-500">support@grovyo.com</a>. We will work to resolve the issue promptly.</p>
					</div>
				</div>
			</section>
		</div>
	)
};

export default page;