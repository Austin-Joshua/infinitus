import TeamBrowser from '@/components/ui/TeamBrowser';

/** Body of the Team page. */
export default function MembersGrid({ members }) {
  return (
    <section className="section !pt-2 sm:!pt-3 pb-12 sm:pb-16">
      <div className="container-x">
        <TeamBrowser members={members} />
      </div>
    </section>
  );
}
