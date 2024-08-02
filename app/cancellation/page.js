import React from "react";

const page = () => {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-6">Grovyo Cancellation and Refund Policy</h1>

			<section className="mb-8">
				<h2 className="text-2xl font-semibold mb-4">Cancellation Policy</h2>
				<div className="space-y-4">
					<div>
						<h3 className="text-xl font-medium">1. Order Cancellation by Users</h3>
						<p>Users can cancel their orders within 12 hours of placing the order. To cancel an order:</p>
						<ul className="list-disc ml-6">
							<li><strong>In-App Cancellation:</strong> Use the cancel button within the app during the 12-hour window from the order time.</li>
							<li><strong>Customer Support:</strong> Alternatively, contact our customer service team at <a href="mailto:support@grovyo.com" className="text-blue-500">support@grovyo.com</a> for assistance.</li>
						</ul>
					</div>
					<div>
						<h3 className="text-xl font-medium">2. Cancellation Policy for Grovyo</h3>
						<p>Once an order is confirmed and processed, it cannot be canceled after the 12-hour window. For any issues or disputes regarding cancellation, please reach out to our customer support team.</p>
					</div>
				</div>
			</section>

			<section className="mb-8">
				<h2 className="text-2xl font-semibold mb-4">Refund Policy</h2>
				<div className="space-y-4">
					<div>
						<h3 className="text-xl font-medium">1. Refund Eligibility</h3>
						<p>Users are eligible for a refund for physical product purchases if they request it within 48 hours of the order’s delivery. To request a refund:</p>
						<ul className="list-disc ml-6">
							<li><strong>Return Request:</strong> Contact our customer service team at <a href="mailto:support@grovyo.com" className="text-blue-500">support@grovyo.com</a> within the 48-hour window.</li>
							<li><strong>In-App Request:</strong> Alternatively, use the in-app request feature to initiate the refund process.</li>
						</ul>
					</div>
					<div>
						<h3 className="text-xl font-medium">2. Non-Refundable Items</h3>
						<p>Refunds are not available for the following:</p>
						<ul className="list-disc ml-6">
							<li><strong>Digital Assets:</strong> No refunds are allowed for the purchase of digital assets, including paid topics and exclusive content.</li>
							<li><strong>Membership Purchases:</strong> No refunds are allowed for membership purchases.</li>
							<li><strong>Special Conditions:</strong> Refunds are not available for items specified as non-refundable at the time of purchase.</li>
						</ul>
					</div>
					<div>
						<h3 className="text-xl font-medium">3. Refund Processing</h3>
						<p>Refunds will be processed as follows:</p>
						<ul className="list-disc ml-6">
							<li><strong>Return Fee:</strong> A processing fee of 40 INR will be charged for handling returns and refunds. This fee is applicable per returned item and will be deducted from the total refund amount. Neither Grovyo nor the seller will be liable for this charge.</li>
							<li><strong>Refund Timeline:</strong> Refunds will be issued to the original payment method within 7-10 business days after the return is processed.</li>
						</ul>
					</div>
				</div>
			</section>

			<section className="mb-8">
				<h2 className="text-2xl font-semibold mb-4">Return Policy</h2>
				<div className="space-y-4">
					<div>
						<h3 className="text-xl font-medium">1. Return Eligibility</h3>
						<p>Returns are accepted for physical items that meet the following criteria:</p>
						<ul className="list-disc ml-6">
							<li><strong>Condition:</strong> Items must be in their original, unused condition with all packaging and tags intact.</li>
							<li><strong>Return Window:</strong> Return requests must be made within 48 hours of delivery.</li>
						</ul>
					</div>
					<div>
						<h3 className="text-xl font-medium">2. Return Process</h3>
						<p>To return an item:</p>
						<ul className="list-disc ml-6">
							<li><strong>Return Request:</strong> Initiate a return request through the app or by contacting customer support at <a href="mailto:support@grovyo.com" className="text-blue-500">support@grovyo.com</a>.</li>
							<li><strong>Return Shipping:</strong> Users are responsible for the return shipping costs unless the item is defective or incorrectly shipped.</li>
						</ul>
					</div>
					<div>
						<h3 className="text-xl font-medium">3. Refund Upon Return</h3>
						<p>Once the returned item is received and inspected, the refund will be processed according to our refund policy.</p>
					</div>
				</div>
			</section>

			<section className="mb-8">
				<h2 className="text-2xl font-semibold mb-4">Special Conditions</h2>
				<div className="space-y-4">
					<div>
						<h3 className="text-xl font-medium">1. Workspace User Refunds</h3>
						<p>For workspace users (creators and businesses), refunds are processed as follows:</p>
						<ul className="list-disc ml-6">
							<li><strong>Payment to Workspace Users:</strong> Payments are made 48 hours after the successful delivery of an order. For earnings from sales, ad displays, and exclusive content, payments are made on the 21st of each month directly to the bank accounts provided by workspace users.</li>
						</ul>
					</div>
					<div>
						<h3 className="text-xl font-medium">2. Shipping and Delivery Issues</h3>
						<p>If there are issues with shipping or delivery, please contact our customer support team for resolution. We will work to address any concerns and facilitate a satisfactory resolution.</p>
					</div>
				</div>
			</section>

			<section className="mb-8">
				<h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
				<p>For any questions or assistance regarding cancellations, refunds, or returns, please contact our customer support team:</p>
				<p><strong>Email:</strong> <a href="mailto:support@grovyo.com" className="text-blue-500">support@grovyo.com</a></p>
			</section>

			<p>By using Grovyo, you acknowledge that you have read, understood, and agree to the terms of this Cancellation and Refund Policy.</p>
		</div>
	);

};

export default page;