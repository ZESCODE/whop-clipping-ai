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
				<h1 className="text-9">No Access</h1>
				<p className="text-3 text-gray-10">
					An active membership in this community is required to use Clipping AI.
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
					Clip for <strong>{displayName}</strong>
				</h1>
				<div className="flex items-center gap-3">
					<Link href="/tools">
						<Button variant="surface" className="w-full" size="3">
							Explore Free Tools
						</Button>
					</Link>
					<Link href="https://docs.whop.com/apps" target="_blank">
						<Button variant="classic" className="w-full" size="3">
							Dev Docs
						</Button>
					</Link>
				</div>
			</div>

			<p className="text-3 text-gray-10">
				Clipping AI transforms long videos into 9:16 Shorts and sends them straight to this
				community&apos;s content-reward bounties. Transcribe → spot highlights → reframe →
				caption → submit.
			</p>

			{access.access_level === "admin" && (
				<p className="text-3 text-gray-11">
					You&apos;re here as an admin of this experience.
				</p>
			)}

			{bountyError && <p className="text-3 text-red-10">Couldn&apos;t load bounties: {bountyError}</p>}

			<ClipStudio bounties={bounties} companyId={companyId || ""} userId={userId} />
		</div>
	);
}
