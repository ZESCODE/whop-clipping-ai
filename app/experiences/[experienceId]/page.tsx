import { Button } from "@whop/react/components";
import { headers } from "next/headers";
import Link from "next/link";
import { whopsdk } from "@/lib/whop-sdk";
import { fetchOpenBounties } from "@/lib/bounties";
import ClipStudio from "@/components/ClipStudio";

export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	const { experienceId } = await params;
	// Ensure the user is logged in on whop.
	const { userId } = await whopsdk.verifyUserToken(await headers());

	// Fetch the necessary data we want from whop.
	const [experience, user, access] = await Promise.all([
		whopsdk.experiences.retrieve(experienceId),
		whopsdk.users.retrieve(userId),
		whopsdk.users.checkAccess(experienceId, { id: userId }),
	]);

	if (!access.has_access) {
		return (
			<div className="flex flex-col p-8 gap-4">
				<h1 className="text-9">Access denied</h1>
				<p className="text-3 text-gray-10">
					You need a valid membership in this community to use Clipping AI.
				</p>
			</div>
		);
	}

	// Open content bounties for the creator's company.
	const companyId = (experience as any).company_id as string;
	let bounties: any[] = [];
	let bountyError = "";
	if (companyId) {
		try {
			bounties = await fetchOpenBounties(companyId);
		} catch (e: any) {
			bountyError = String(e?.message || e);
		}
	}

	const displayName = user.name || `@${user.username}`;

	return (
		<div className="flex flex-col p-8 gap-8 max-w-5xl">
			<div className="flex justify-between items-center gap-4">
				<h1 className="text-9">
					Clip <strong>{displayName}</strong>
				</h1>
				<Link href="https://docs.whop.com/apps" target="_blank">
					<Button variant="classic" className="w-full" size="3">
						Developer Docs
					</Button>
				</Link>
			</div>

			<p className="text-3 text-gray-10">
				Clipping AI turns long-form video into 9:16 Shorts and submits them straight to this
				community&apos;s content-rewards bounties. Transcribe → detect → reframe → captions →
				submit.
			</p>

			{access.access_level === "admin" && (
				<p className="text-3 text-gray-11">
					You&apos;re viewing as an admin of this experience.
				</p>
			)}

			{bountyError && <p className="text-3 text-red-10">Bounties unavailable: {bountyError}</p>}

			<ClipStudio bounties={bounties} companyId={companyId || ""} userId={userId} />
		</div>
	);
}
