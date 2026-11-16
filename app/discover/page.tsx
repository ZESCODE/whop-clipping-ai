export default function DiscoverPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
			<div className="max-w-4xl mx-auto px-4 py-16">
				{/* Title */}
				<h1 className="text-5xl font-bold text-gray-900 mb-6 text-center">
					Meet the App
				</h1>
				{/* Main Description Card */}
				<div className="frost-card p-8 text-center mb-16">
					<p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
						This is your app&apos;s discovery page — show what it does and how it helps
						creators win.
					</p>
					<p className="text-base text-gray-500 max-w-2xl mx-auto mb-2">
						Share genuine success stories, link to buzzing Whop communities that use
						your app, and drop referral links to earn affiliate fees every time
						someone installs it.
					</p>
					<p className="text-sm text-gray-400 max-w-2xl mx-auto">
						💡 <strong>Tip:</strong> Spell out what makes your app worth using and how
						it helps creators earn money or grow their communities.
					</p>
				</div>

				{/* Pro Tips Section */}
				<div className="grid md:grid-cols-2 gap-6 mb-10">
					<div className="frost-card p-6 flex flex-col gap-2">
						<h3 className="font-semibold text-gray-900">
							Lead With Real Wins
						</h3>
						<p className="text-sm text-gray-600">
							Point to actual Whop communities running on your app, complete with
							revenue and member numbers.
						</p>
					</div>
					<div className="frost-card p-6 flex flex-col gap-2">
						<h3 className="font-semibold text-gray-900">
							Add Referral Links
						</h3>
						<p className="text-sm text-gray-600">
							Tack <code>?a=your_app_id</code> onto Whop links to earn
							affiliate commissions.
						</p>
					</div>
				</div>

				<h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
					Real Wins, Real Numbers
				</h2>

				{/* Main Content Cards */}
				<div className="grid md:grid-cols-2 gap-6">
					{/* Success Story Card 1 */}
					<div className="frost-card p-6 flex flex-col justify-between">
						<div>
							<h3 className="text-lg font-bold text-gray-900 mb-1">
								CryptoKings
							</h3>
							<p className="text-xs text-gray-500 mb-2">
								Trading Hub
							</p>
							<p className="text-gray-700 mb-4 text-sm">
								"Hit{" "}
								<span className="font-bold text-blue-600">
									2,500+ members
								</span>{" "}
								and{" "}
								<span className="font-bold text-blue-600">
									$18,000+/mo
								</span>{" "}
								with automated signals. Members can&apos;t get enough of the
								real-time alerts!"
							</p>
						</div>
						<a
							href="https://whop.com/cryptokings/?a=your_app_id"
							className="mt-auto block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center text-sm"
						>
							Explore CryptoKings
						</a>
					</div>

					{/* Success Story Card 2 */}
					<div className="frost-card p-6 flex flex-col justify-between">
						<div>
							<h3 className="text-lg font-bold text-gray-900 mb-1">
								SignalPro
							</h3>
							<p className="text-xs text-gray-500 mb-2">
								Top-Tier Signals
							</p>
							<p className="text-gray-700 mb-4 text-sm">
								"Retention soared to{" "}
								<span className="font-bold text-blue-600">92%</span>.
								The affiliate program pulled in{" "}
								<span className="font-bold text-blue-600">$4,000+</span>{" "}
								last quarter."
							</p>
						</div>
						<a
							href="https://whop.com/signalpro/?app=your_app_id"
							className="mt-auto block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center text-sm"
						>
							Explore SignalPro
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
