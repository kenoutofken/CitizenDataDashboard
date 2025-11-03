export default function IndicatorDetails() {
  return (
    <div className="flex flex-wrap gap-8 pt-12 pb-12 px-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-15 card bg-base-100 flex-1 shadow-lg pt-6 pb-6 px-6">
        {/* LEFT COLUMN */}
        <div>
          <h2 className="text-[32px] font-semibold mb-3">Current Status</h2>
          <div className="badge badge-warning gap-2 mb-6 text-sm p-5">
            ✖ NEEDS IMPROVING
          </div>

          <h3 className="text-[32px] font-semibold mb-2">Key Partners</h3>
          <p className="text-gray-700 text-base mb-3">
            Meeting our target requires support from:
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="badge bg-[#D9D9D5] p-3">Federal government</div>
            <div className="badge bg-[#D9D9D5] p-3">Provincial government</div>
            <div className="badge bg-[#D9D9D5] p-3">
              Regional government and services
            </div>
          </div>

          <h3 className="text-[32px] font-semibold mb-2">
            Ask questions and give feedback
          </h3>
          <p className="text-gray-700 text-base mb-3">
            Meeting our target requires support from:
          </p>
          <button className="btn bg-[#0279B1] text-white">Contact us</button>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <h2 className="text-[32px] font-semibold mb-3">
            Sustainable Development Goals
          </h2>
          <p className="text-gray-700 text-base mb-2">
            This indicator aligns with:
          </p>
          <div className="badge bg-[#D9D9D5] p-3 mb-6">
            Sustainable cities and communities
          </div>

          <h3 className="font-semibold text-base mb-2">Related indicators:</h3>
          <ul className="list-disc list-inside space-y-1 text-sky-700 text-base">
            <li>
              <a href="#" className="link link-hover">
                Walking and cycling trips on a typical weekday
              </a>
            </li>
            <li>
              <a href="#" className="link link-hover">
                People experiencing homelessness
              </a>
            </li>
            <li>
              <a href="#" className="link link-hover">
                Adults with a sense of community belonging
              </a>
            </li>
            <li>
              <a href="#" className="link link-hover">
                Mode share (trips made by foot, bike, or transit)
              </a>
            </li>
            <li>
              <a href="#" className="link link-hover">
                Adults who feel safe walking alone in their neighbourhood at
                night
              </a>
            </li>
            <li>
              <a href="#" className="link link-hover">
                Adults with 4+ people to confide in or turn to for help
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
