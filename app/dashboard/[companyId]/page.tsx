import { Button } from "@whop/react/components";
import { headers } from "next/headers";
import Link from "next/link";
import { whopsdk } from "@/lib/whop-sdk";
import { fetchCreatorOverview } from "@/lib/creator";
import CreatorDashboard from "@/components/CreatorDashboard";

export default async function DashboardPage({
	params,
}: {
	params: Promise<{ companyId: string }>;
}) {
	const { companyId } = await params;
	// Ensure the user is logged in on whop.
	const { userId } = await whopsdk.verifyUserToken(await headers());

	const [company, user, access] = await Promise.all([
		whopsdk.companies.retrieve(companyId),
		whopsdk.users.retrieve(userId),
		whopsdk.users.checkAccess(companyId, { id: userId }),
	]);

	if (access.access_level !== "admin") {
		return (
			<div className="flex flex-col p-8 gap-4">
				<h1 className="text-9">Admin Access Required</h1>
				<p className="text-3 text-gray-10">
					Only account admins can open the creator dashboard.
				</p>
			</div>
		);
	}

	let overview: Awaited<ReturnType<typeof fetchCreatorOverview>> | null = null;
	let overviewError = "";
	try {
		overview = await fetchCreatorOverview(companyId);
	} catch (e: any) {
		overviewError = String(e?.message || e);
	}

	const displayName = user.name || `@${user.username}`;

	return (
		<div className="flex flex-col p-8 gap-8 max-w-6xl">
			<div className="flex justify-between items-center gap-4">
				<h1 className="text-9">
					{displayName}&apos;s <strong>Creator Hub</strong>
				</h1>
				<Link href="https://docs.whop.com/apps" target="_blank">
					<Button variant="classic" className="w-full" size="3">
						Dev Docs
					</Button>
				</Link>
			</div>

			<p className="text-3 text-gray-10">
				Check clip submissions against your content-reward bounties, then approve and pay
				creators through Whop.
			</p>

			{overviewError && (
				<p className="text-3 text-red-10">Couldn&apos;t load Whop data: {overviewError}</p>
			)}

			{overview && (
				<CreatorDashboard
					bounties={overview.bounties}
					payouts={overview.payouts}
					companyId={companyId}
				/>
			)}
		</div>
	);
}
