export default function Rationale() {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8 pt-12 px-12">
        <div className="card bg-base-100 flex-1 shadow-md">
          <div className="card-body">
            <h2 className="text-xl font-semibold">Why we measure this</h2>
            <p className="text-base">
              To understand how many households may face challenges to find
              housing they can afford. Safe, secure, suitable, and affordable
              housing is a basic need for everyone. Unaffordable housing is a
              major challenge for many people in Vancouver.
            </p>
          </div>
        </div>

        <div className="card bg-base-100 flex-1 shadow-md">
          <div className="card-body">
            <h2 className="text-xl font-semibold">Our Comments</h2>
            <p className="text-base">
              Well over one third of Vancouver households are spending more than
              30% of their income for housing. This is one of the highest rates
              in Canada, and has not changed significantly in ten years. Renter
              households, lower-income households, and Indigenous households are
              more likely to face challenges with unaffordable housing. The
              Housing Vancouver Strategy includes targets for housing accessible
              to all income levels and needs
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
