import TeamBrowser from '@/components/ui/TeamBrowser';

/** Body of the Team page. */
export default function MembersGrid({ members }) {
  return (
    <section className="section !pt-4 sm:!pt-6 pb-20">
      <div className="container-x">
        <TeamBrowser members={members} />
      </div>
    </section>
  );
}
